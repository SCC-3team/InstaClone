from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def PPE():
    return render_template('profilepage.edit.html')


@app.route("/PPE", methods=["POST"])
def PPE_post():
    ID_receive = request.form['ID_give']
    introduce_receive = request.form['introduce_give']
    image_receive = request.form['image_give']
    doc = {
        'Id':ID_receive,
        'introduce':introduce_receive,
        'image':image_receive
    }
    db.mars.insert_one(doc)

    return jsonify({'msg': '프로필 수정 완료'})



@app.route("/ProfilePageEdit", methods=["GET"])
def PPE_get():
    return jsonify({'msg': 'GET 연결 완료!'})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5200, debug=True)
