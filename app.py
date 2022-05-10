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
        return render_template('profilepage.html', user_info=user_info, status=status)
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
            # JWT 토큰에는, payload와 시크릿키가 필요하다.
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
        "username": username_receive,     # 아이디
        "usermail": usermail_receive,     # 이메일
        "password": password_hash,        # 비밀번호
        "profile_name": username_receive, # 프로필 이름 기본갑
        "profile_pic": "",                # 프로필 사진 파일
        "profile_pic_real": "profile_pics.profile_placeholder.png",  # 프로필 사진 기본
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})

@app.route('/posting', methods=['POST'])
def posting():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        # 포스팅(댓글)하기
        user_info = db.users.find_one({"username": payload["id"]})
        comment_receive = request.form["comment_give"]
        date_receive = request.form["date_give"]
        print(type(date_receive))
        doc = {
            "username": user_info["username"],
            "profile_name": user_info["profile_name"],
            "profile_pic_real": user_info["profile_pic_real"],
            "comment": comment_receive,
            "date": date_receive
        }
        db.posts.insert_one(doc)
        return jsonify({"result": "success", 'msg': '댓글 성공'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route("/get_posts", methods=['GET'])
def get_posts():
    # 댓글 받아오는 get
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        my_username = payload["id"]
        username_receive = request.args.get("username_give")
        if username_receive=="":
            posts = list(db.posts.find({}).sort("date", -1).limit(20))
        else:
            posts = list(db.posts.find({"username":username_receive}).sort("date", -1).limit(20))

        for post in posts:
            post["_id"] = str(post["_id"])

        return jsonify({"result": "success", "msg": "댓글을 가져왔습니다.", "posts": posts})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route('/uploading')
def uploading():
    return render_template('upload.html')


@app.route('/upload', methods=['POST'])
def UploadReceive():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})

        picture_receive = request.form['image']
        contents_receive = request.form['content']
        date_receive = request.form["date_give"]
        print(type(date_receive))

        doc = {
            "username": user_info["username"],
            "profile_name": user_info["profile_name"],
            "image": picture_receive,
            "content": contents_receive,
            "date": date_receive
        }

        db.feeds.insert_one(doc)
        return jsonify({"result": "success", 'msg': '게시물이 업로도 되었습니다'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

@app.route("/get_upload", methods=['GET'])
def get_upload():
    # 댓글 받아오는 get
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        my_username = payload["id"]
        username_receive = request.args.get("username_give")
        if username_receive=="":
            feeds = list(db.feeds.find({}).sort("date", -1).limit(20))
        else:
            feeds = list(db.feeds.find({"username":username_receive}).sort("date", -1).limit(20))

        for feed in feeds:
            feed["_id"] = str(feed["_id"])

        return jsonify({"result": "success", "msg": "피드를 가져왔습니다.", "feeds": feeds})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
