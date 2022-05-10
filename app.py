from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

from pymongo import MongoClient
import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://text:sparta@cluster0.ezoan.mongodb.net/Cluster0?retryWrites=true&w=majority',
                     tlsCAFile=ca)
db = client.dbsparta

# 메인페이지 html 불러오기

@app.route('/')
def home():
    return render_template('mainpage.html')

# 불러온 메인페이지 html 페이지에 post 요청으로 댓글을 집어넣기
# /instacommets 로 이름을 지어주고
# dbprac 인써트 삽입하기를 불러와주고
# doc 변수를 정해줌. 넘버를 달아서 댓글 순서를 찍어줘야 나중에 삭제할 때도 그거 하나만 삭제할 수 있음.
# (코멘트 리스트를 리스트로 변수정의하고 그걸 len을 써서 +1을 더해 1, 2, 3 넘버를 만들어 카운트로 정의해줌)
# comments를 commentes_receive로 받고
# delete도 만들어줌. 일단 0으로 두고
# 다음 html로 넘어가서

@app.route("/instacomments", methods=["POST"])
def comments_post():
    comments_receive = request.form['comments_give']

    comments_list = list(db.comments.find({}, {'_id':False}))
    count = len(comments_list) + 1

    doc = {
        'num':count,
        'comments':comments_receive,
        'delete':0
    }

    db.comments.insert_one(doc)

    return jsonify({'msg': 'POST(기록) 연결 완료!'})


@app.route("/instacomments", methods=["POST"])
def comments_delete():
    sample_receive = request.form['sample_give']
    print(sample_receive)
    return jsonify({'msg': 'POST(완료) 연결 완료!'})


# get 요청은 쉬움. 코멘트 리스트로 리스틀 쭉 불러오고
# html 작업으로 넘어가서

@app.route("/isntacomments", methods=["GET"])
def comments_get():
    comments_list = list(db.comments.find({}, {'_id':False}))


    return jsonify({'comments':comments_list})




if __name__ == '__main__':
    app.run('0.0.0.0', port=5200, debug=True)