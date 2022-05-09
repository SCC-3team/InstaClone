from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'

client = MongoClient('mongodb+srv://test:sparta@cluster0.mdx5k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
db = client.dbsparta


@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        # token을 시크릿키로 복호화
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        return render_template('mainpage.html', user_info=user_info)
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('loginpage.html', msg=msg)


@app.route('/signup')
def signup():
    return render_template('signup_page.html')


@app.route('/user/<username>')
def user(username):
    # 각 사용자의 프로필과 글을 모아볼 수 있는 공간
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        status = (username == payload["id"])  # 내 프로필이면 True, 다른 사람 프로필 페이지면 False

        user_info = db.users.find_one({"username": username}, {"_id": False})
        return render_template('user.html', user_info=user_info, status=status)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    # 회원가입 때와 같은 방법으로 pw를 암호화한다.
    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    # id, 암호화된 pw를 가지고 해당 유저를 찾는다.
    result = db.users.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
            # JWT 토큰에는, payload와 시크릿키가 필요하다. (이게 필요한 이유는 상세하게 위에 소개한 링크에 나와있다.)
            # 시크릿키가 있어야 토큰을 복호화해서 payload 값을 볼 수 있다.
            # id와 exp를 담는다. JWT 토큰을 풀면 유저ID 값을 알 수 있다.
            # exp에는 만료시간을 넣어준다. 만료시간이 지나면, 시크릿키로 토큰을 풀때 만료되었다고 에러가 난다.
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        # 토큰을 줍니다.
        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    usermail_receive = request.form['usermail_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "username": username_receive,
        "usermail": usermail_receive,
        "password": password_hash,
        "profile_name": username_receive,
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})

@app.route('/comment', methods=['POST'])
def comment():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        comment_receive = request.form["comment_give"]
        date_receive = request.form["date_give"]
        doc = {
            "username": user_info["username"],
            "profile_name": user_info["profile_name"],
            "comment": comment_receive,
            "date": date_receive
        }
        #코멘트 db에 저장
        db.comments.insert_one(doc)
        return jsonify({"result": "success", 'msg': '댓글 성공'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route("/get_comment", methods=['GET'])
def get_comment():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        username_receive = request.args.get("username_give")
        if username_receive == "":
            comments = list(db.comments.find({}).sort("date", -1).limit(20))
        else:
            comments = list(db.comments.find({"username": username_receive}).sort("date", -1).limit(20))
        """
        for comment in comments:
            #문자열 변환하기
            comment["_id"] = str(comment["_id"])

            좋아요 엄지척 구현부분 일단 제외
            comment["count_heart"] = db.likes.count_documents({"comment_id": comment["_id"], "type": "heart"})
            comment["heart_by_me"] = bool(
                db.likes.find_one({"comment_id": comment["_id"], "type": "heart", "username": payload['id']}))

            comment["count_star"] = db.likes.count_documents({"comment_id": comment["_id"], "type": "star"})
            comment["star_by_me"] = bool(
                db.likes.find_one({"comment_id": comment["_id"], "type": "star", "username": payload['id']}))

            comment["count_thumbs"] = db.likes.count_documents({"comment_id": comment["_id"], "type": "thumbs"})
            comment["thumbs_by_me"] = bool(
                db.likes.find_one({"comment_id": comment["_id"], "type": "thumbs", "username": payload['id']}))
            """
        return jsonify({"result": "success", "msg": "댓글을 가져왔습니다.", "comments": comments})

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))





#중복조회 관련 함수 아직 미구현
@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})






if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
