
function posting() {
    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            comment_give: comment,
            date_give: today
        },
        success: function (response) {
            window.location.reload()
            alert(response['msg'])

        }
    })
}

function get_posts(username) {
    if (username == undefined) {
        username = ""
    }
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_posts?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)
                    let html_temp = `<div class="comment-explanation" id="${post["_id"]}">
                                        <article class="comment-explanation">                                           
                                              <div> 
                                              <p>                        
                                                    <strong>${post['profile_name']}</strong> <small>${time_before}</small>
                                                    <br>                                           
                                                        ${post['comment']}
                                              </p>                                                                                                     
                                              </div>                                     
                                        </article>
                                    </div>`
                    $("#post-box").append(html_temp)
                }
            }
        }
    })
}

function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}


function get_upload(username) {
    if (username == undefined) {
        username = ""
    }
    $("#feed-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_upload?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let feeds = response["feeds"]
                for (let i = 0; i < feeds.length; i++) {
                    let feed = feeds[i]
                    let time_feed = new Date(feed["date"])
                    let time_before = time2str(time_feed)
                    let html_temp = `<div class="article1" id="${feed["_id"]}">

                                    <!--              메인 피드 창 프로필 표시                          -->

                                    <div class="feedback-name">
                                        <div class="feedback-name2">

                                            <!--              피드 창 프로필 이름 해더                    -->

                                            <div class="feedback-name-header">

                                                <!--              피드 창 프로필 사진                    -->
                                                <!--              src를 변경할지 백그라운드 이미지를 변경할지 ??                    -->
                                                <!--              백그라운드 이미지 변경일 경우 CSS를 바꾸는 JQuery필요한데 상당히 번거로움 CSS를 개별적으로 하나씩 다 붙여야 함               -->
                                                <!--              scr를 변경할 경우 이미지 캔버스를 통째로 temp_html해야함                    -->

                                                <div class="fn-b-pic">
                                                    <div class="fb-n-pic1">
                                                        <canvas class="canvas-b"></canvas>
                                                        <span class="main-contents-nav-profile-pic1" role="link"
                                                              tabindex="-1">
                                                                <img alt="" class="main-contents-nave-profile-pic2"
                                                                     crossorigin="anonymous" data-testid="user-avatar"
                                                                     draggable="false" src="">
                                                            </span>
                                                    </div>
                                                </div>

                                                <!--              피드 창 프로필 이름                    -->
                                                <!--              피드 창 프로필 이름 Id                 -->

                                                <div class="fb-n-title">
                                                    <div class="fb-n-title-up">
                                                        <div class="fbntu-1">
                                                            <div class="fbntu-2">
                                                                <a class="fbntu-span" tabindex="0"> ${feed['profile_name']} <small>${time_before}</small></a>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!--              피드 창 프로필 이름 테그                -->

                                                    <div class="fb-n-title-down">
                                                        <div class="fbntd-1">
                                                            <div class="fbntd-2">
                                                                <div class="fbntd-3">
                                                                    <a class="fbntd-Atag"
                                                                       href="https://www.jejusi.go.kr/index.ac"
                                                                       tabindex="0">Jeju Island</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!--              피드 창 프로필 모달 쩜쩜쩜                   -->
                                            <!--               기능은 없음                   -->

                                            <div class="feedback-name-tag">
                                                <button class="fnt-btn">
                                                    <div class="fnt-btn-1">
                                                        <div class="fnt-btn-2">
                                                            <svg class="fnt-btn-svg" aria-label="More options"
                                                                 role="img" viewBox="0 0 24 24">
                                                                <circle cx="4" cy="12" r="1.5"></circle>
                                                                <circle cx="12" cy="12" r="1.5"></circle>
                                                                <circle cx="20" cy="12" r="1.5"></circle>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!--              피드 창 부트스트랩 캐러셀                          -->
                                    <!--              아이디 값 바꿔주고 밑에 data-bs-target 아이디 같이 가줘야 작동함                     -->

                                    <div class="feed_img">
                                        <div id="carouselExampleControlsNoTouching" class="carousel slide"
                                             data-bs-touch="false" data-bs-interval="false">
                                            <div class="carousel-inner">

                                                <!--             첫번째 사진 src 경로 입력               -->

                                                <div class="carousel-item active">
                                                    <img src="${feed['image']}"                                                         
                                                         class="d-block w-100" alt="...">
                                                </div>

                                                <!--             왠만하면 두번째 사진까지라도 같이 가져가서 temp_html 해야함               -->
                                                <!--             div 클래스가 다르기 때문임.               -->

                                                <div class="carousel-item">
                                                    <img src="${feed['image']}"
                                                         class="d-block w-100" alt="...">
                                                </div>
                                                <div class="carousel-item">
                                                    <img src=src="/static/${feed['image']}"
                                                         class="d-block w-100" alt="...">
                                                </div>
                                            </div>

                                            <!--             캐러셀 사진 이동 버튼임               -->
                                            <!--             data-bs-target을 해당 캐러셀과 같은 값을 줘야함               -->
                                            <!--             보통 타겟아이디 뒤에 숫자를 붙이는게 쉬움               -->
                                            <!--             ex) target1 , target1-1, target1-2               -->

                                            <button class="carousel-control-prev" type="button"
                                                    data-bs-target="#carouselExampleControlsNoTouching"
                                                    data-bs-slide="prev">
                                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Previous</span>
                                            </button>
                                            <button class="carousel-control-next" type="button"
                                                    data-bs-target="#carouselExampleControlsNoTouching"
                                                    data-bs-slide="next">
                                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Next</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!--              피드 창 컨텐츠 표시                          -->

                                    <div class="feedback-contents">
                                        <div class="feedback-contents-layout">
                                            <section class="fsl-buttons">

                                                <!--                   좋아요 버튼 - 기능없음                           -->

                                                <span class="span-like">
                                                        <button class="like-btn">
                                                            <i class="fa-regular fa-heart fa-2xl">
                                                        </i>
                                                        </button>
                                                    </span>

                                                <!--                   메세지보내기 버튼 - 생각없이 만듬                            -->

                                                <span class="span-like">
                                                        <button class="like-btn">
                                                            <i class="fa-regular fa-envelope fa-2xl"></i>
                                                            </i>
                                                        </button>
                                                    </span>

                                                <!--                   댓글 달기 버튼 - 피드 모달 창 띄워주기                             -->

                                                <span class="span-like">
                                                        <button class="like-btn">
                                                            <i class="fa-regular fa-comment fa-2xl"></i>
                                                            </i>
                                                        </button>
                                                    </span>

                                                <!--                   POST 버튼 - 기능 없음                             -->

                                                <div class="span-post1">
                                                        <span class="span-post">
                                                        <button class="like-btn">
                                                            <i class="fa-regular fa-bookmark fa-2xl"></i>
                                                            </i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </section>

                                            <!--                     좋아요 카운트                        -->

                                            <section class="like-count">
                                                <div class="like-count1">
                                                    <a href="">60 likes</a>
                                                </div>
                                            </section>

                                            <!--                     컨텐츠 텍스트랑 설명                        -->

                                            <div class="comments">
                                                <div class="explanation">

                                                    <!--                     등록 유저 아이디랑 설명                        -->

                                                    <div>
                                                        <div class="explan-ID"> ${feed['profile_name']} </a></div>
                                                        <div class="comment-explanation"> ${feed['content']}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>`
                    $("#feed-box").append(html_temp)
                }
            }
        }
    })
}


function get_posts(username) {
    if (username == undefined) {
        username = ""
    }
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_posts?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)
                    let html_temp = `<div class="comment-explanation" id="${post["_id"]}">
                                        <article class="comment-explanation">                                           
                                              <div> 
                                              <p>                        
                                                    <strong>${post['profile_name']}</strong> <small>${time_before}</small>
                                                    <br>                                           
                                                        ${post['comment']}
                                              </p>                                                                                                     
                                              </div>                                     
                                        </article>
                                    </div>`
                    $("#post-box").append(html_temp)
                }
            }
        }
    })
}

function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}


function get_upload(username) {
    if (username == undefined) {
        username = ""
    }
    $("#feed-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_upload?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let feeds = response["feeds"]
                for (let i = 0; i < feeds.length; i++) {
                    let feed = feeds[i]
                    let time_feed = new Date(feed["date"])
                    let time_before = time2str(time_feed)
                    let html_temp = `<div class="article1" id="${feed["_id"]}">

                                    <!--              메인 피드 창 프로필 표시                          -->

                                    <div class="feedback-name">
                                        <div class="feedback-name2">

                                            <!--              피드 창 프로필 이름 해더                    -->

                                            <div class="feedback-name-header">

                                                <!--              피드 창 프로필 사진                    -->
                                                <!--              src를 변경할지 백그라운드 이미지를 변경할지 ??                    -->
                                                <!--              백그라운드 이미지 변경일 경우 CSS를 바꾸는 JQuery필요한데 상당히 번거로움 CSS를 개별적으로 하나씩 다 붙여야 함               -->
                                                <!--              scr를 변경할 경우 이미지 캔버스를 통째로 temp_html해야함                    -->

                                                <div class="fn-b-pic">
                                                    <div class="fb-n-pic1">
                                                        <canvas class="canvas-b"></canvas>
                                                        <span class="main-contents-nav-profile-pic1" role="link"
                                                              tabindex="-1">
                                                                <img alt="" class="main-contents-nave-profile-pic2"
                                                                     crossorigin="anonymous" data-testid="user-avatar"
                                                                     draggable="false" src="">
                                                            </span>
                                                    </div>
                                                </div>

                                                <!--              피드 창 프로필 이름                    -->
                                                <!--              피드 창 프로필 이름 Id                 -->

                                                <div class="fb-n-title">
                                                    <div class="fb-n-title-up">
                                                        <div class="fbntu-1">
                                                            <div class="fbntu-2">
                                                                <a class="fbntu-span" tabindex="0"> ${feed['profile_name']} <small>${time_before}</small></a>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!--              피드 창 프로필 이름 테그                -->

                                                    <div class="fb-n-title-down">
                                                        <div class="fbntd-1">
                                                            <div class="fbntd-2">
                                                                <div class="fbntd-3">
                                                                    <a class="fbntd-Atag"
                                                                       href="https://www.jejusi.go.kr/index.ac"
                                                                       tabindex="0">Jeju Island</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!--              피드 창 프로필 모달 쩜쩜쩜                   -->
                                            <!--               기능은 없음                   -->

                                            <div class="feedback-name-tag">
                                                <button class="fnt-btn">
                                                    <div class="fnt-btn-1">
                                                        <div class="fnt-btn-2">
                                                            <svg class="fnt-btn-svg" aria-label="More options"
                                                                 role="img" viewBox="0 0 24 24">
                                                                <circle cx="4" cy="12" r="1.5"></circle>
                                                                <circle cx="12" cy="12" r="1.5"></circle>
                                                                <circle cx="20" cy="12" r="1.5"></circle>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!--              피드 창 부트스트랩 캐러셀                          -->
                                    <!--              아이디 값 바꿔주고 밑에 data-bs-target 아이디 같이 가줘야 작동함                     -->

                                    <div class="feed_img">
                                        <div id="carouselExampleControlsNoTouching" class="carousel slide"
                                             data-bs-touch="false" data-bs-interval="false">
                                            <div class="carousel-inner">

                                                <!--             첫번째 사진 src 경로 입력               -->

                                                <div class="carousel-item active">
                                                    <img src="${feed['image']}"                                                         
                                                         class="d-block w-100" alt="...">
                                                </div>

                                                <!--             왠만하면 두번째 사진까지라도 같이 가져가서 temp_html 해야함               -->
                                                <!--             div 클래스가 다르기 때문임.               -->

                                                <div class="carousel-item">
                                                    <img src="${feed['image']}"
                                                         class="d-block w-100" alt="...">
                                                </div>
                                                <div class="carousel-item">
                                                    <img src="${feed['image']}"
                                                         class="d-block w-100" alt="...">
                                                </div>
                                            </div>

                                            <!--             캐러셀 사진 이동 버튼임               -->
                                            <!--             data-bs-target을 해당 캐러셀과 같은 값을 줘야함               -->
                                            <!--             보통 타겟아이디 뒤에 숫자를 붙이는게 쉬움               -->
                                            <!--             ex) target1 , target1-1, target1-2               -->

                                            <button class="carousel-control-prev" type="button"
                                                    data-bs-target="#carouselExampleControlsNoTouching"
                                                    data-bs-slide="prev">
                                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Previous</span>
                                            </button>
                                            <button class="carousel-control-next" type="button"
                                                    data-bs-target="#carouselExampleControlsNoTouching"
                                                    data-bs-slide="next">
                                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Next</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!--              피드 창 컨텐츠 표시                          -->

                                    <div class="feedback-contents">
                                        <div class="feedback-contents-layout">
                                            <section class="fsl-buttons">

                                                <!--                   좋아요 버튼 - 기능없음                           -->

                                                <span class="span-like">
                                                        <button class="like-btn">
                                                            <i class="fa-regular fa-heart fa-2xl">
                                                        </i>
                                                        </button>
                                                    </span>

                                                <!--                   메세지보내기 버튼 - 생각없이 만듬                            -->

                                                <span class="span-like">
                                                        <button class="like-btn">
                                                            <i class="fa-regular fa-envelope fa-2xl"></i>
                                                            </i>
                                                        </button>
                                                    </span>

                                                <!--                   댓글 달기 버튼 - 피드 모달 창 띄워주기                             -->

                                                <span class="span-like">
                                                        <button class="like-btn">
                                                            <i class="fa-regular fa-comment fa-2xl"></i>
                                                            </i>
                                                        </button>
                                                    </span>

                                                <!--                   POST 버튼 - 기능 없음                             -->

                                                <div class="span-post1">
                                                        <span class="span-post">
                                                        <button class="like-btn">
                                                            <i class="fa-regular fa-bookmark fa-2xl"></i>
                                                            </i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </section>

                                            <!--                     좋아요 카운트                        -->

                                            <section class="like-count">
                                                <div class="like-count1">
                                                    <a class="btn_i btn-open-popup">60 likes</a>
                                                </div>
                                            </section>

                                            <!--                     컨텐츠 텍스트랑 설명                        -->

                                            <div class="comments">
                                                <div class="explanation">

                                                    <!--                     등록 유저 아이디랑 설명                        -->

                                                    <div>
                                                        <div class="explan-ID"> ${feed['profile_name']} </a></div>
                                                        <div class="comment-explanation"> ${feed['content']}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div class="modal">
    <div class="feed_like_wrap">
        <div class="feed_like">
            <div class="feed_like_upper">
                <div class="feed_like_text">
                    <div class="feed_like_text_b"><b>좋아요</b></div>
                </div>
                <div class="feed_like_exit">
                    <div class="feed_like_exit_btn">
                        <a class="anchor" href="">
                            <i class="fa-solid fa-x "></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="feed_like_lower">
                <div class="feed_like_lower_list">
                    <div class="feed_like_lower_sep">
                        <div class="feed_like_lower_img">
                            <a class="anchor" href="">
                                <img class="feed_like_lower_img_size"
                                     src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fd8nSgN%2FbtrAYt0iXBr%2FZho1yiQHDSOZU0MDmdiopK%2Fimg.webp"/></a>
                        </div>
                        <div class="feed_like_lower_accounts">
                            <div class="feed_like_lower_account">
                                <a class="anchor" href=""><b>${feed['profile_name']}</b></a>
                            </div>
                            <div class="feed_like_lower_account_follow">
                                <div>
                                    <a class="anchor" href="">j_h_84님 외 1명이 팔로우합니다</a>
                                </div>
                            </div>
                        </div>
                        <a class="anchor" href="">
                            <div class="feed_like_lower_btn_follow">
                                <b>팔로우</b>
                            </div>
                        </a>
                    </div>

                </div>

            </div>
        </div>

    </div>
</div> <!--버튼 누르면 나오는 부분-->
<script>
    const body = document.querySelector('body');
    const modal = document.querySelector('.modal');
    const btnOpenPopup = document.querySelector('.btn-open-popup');

    btnOpenPopup.addEventListener('click', () => {
        modal.classList.toggle('show');

        if (modal.classList.contains('show')) {
            body.style.overflow = 'hidden';
        }
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.toggle('show');

            if (!modal.classList.contains('show')) {
                body.style.overflow = 'auto';
            }
        }
    });
</script> <!--모달 스크립트-->`
                    $("#feed-box").append(html_temp)
                }
            }
        }
    })
}




