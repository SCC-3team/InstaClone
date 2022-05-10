from flask import Flask, render_template, request, jsonify

app = Flask(__name__)



@app.route('/')
def home():
    return render_template('mainpage.html')

@app.route('upload', methods=['POST'])
def UploadReceive():
    token_receive = request.cookies.get('mytoken')
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    user_info = db.users.find_one({"user_email": payload['id']})

    picture_receive = request.form['fd']
    contents_receive = request.form['fd']
    profile_receive = request.form['fd']
    userID_receive = user_info['_id']

    doc = {
        'image': picture_receive,
        'content': contents_receive,
        'user_id': userID_receive,
        'profile_image': profile_receive,
        'feed_time': dt.datetime.utcnow()
    }
    db.feeds.insert_one(doc)
    return jsonify({'result': 'success', 'msg': '게시물이 업로드 되었습니다.'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
