    <!--    코멘트 포스트 함수-->
     function comment() {
         let comment = $("#textarea-comment").val()
         let today = new Date().toISOString()

         if (comment == "") {
             alert('텍스트를 입력하세요.')
         } else {
             $.ajax({
                 type: "POST",
                 url: "/comment",
                 data: {
                     comment_give: comment,
                     date_give: today
                 },
                 success: function (response) {
                     alert(response['msg'])
                     window.location.reload()
                 }
             })
         }
     }

     function get_comment(username) {
        if (username == undefined) {
            username = ""
        }
        $("#comment-box").empty()
        $.ajax({
             type: "GET",
             url: '/get_comment?username_give=${username}',
             data: {},
             success: function (response) {
                 if (response["result"] == "success") {
                     let comments = response["comments"]
                     for (let i = 0; i < comments.length; i++) {
                         let comment = comments[i]
                         let time_comment = new Date(comment["date"])
                         let time_before = time2str(time_comment)
                         let temp_html = <div class="box" id="${comment["id"]}">

                                            <article className="media">
                                                <div className="media-content">
                                                    <div className="content">
                                                        <p>
                                                            <strong>${comment['profile_name']}</strong>
                                                            <small>@${comment['username']}</small>
                                                            <small>${time_before}</small>
                                                            <br>
                                                                ${comment['comment']}
                                                            </br>
                                                        </p>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                         $("#comment-box").append(temp_html)
                     }
                 }
             }
        })
     }


    function time2str(date) {
        let today = new Date()
        let time = (today - date) / 1000 / 60 //분

        if (time < 60) {
            return parseInt(time) + "분 전"
        }

        time = time / 60 // 시간
        if (time < 24) {
            return parseInt(time) + "시간 전"
        }
        time = time / 24
        if (time < 7) {
            return parseInt(time) + "일 전"
        }
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    }