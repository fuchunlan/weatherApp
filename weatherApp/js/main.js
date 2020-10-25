window.onload = function() {
    const searchNode = document.querySelector('#search_form input')
    const cityNode = document.querySelector('.infomation>.now .city')
    const searchBtn = document.querySelector('.search-btn')
    const timeNode = document.querySelectorAll('.now-city-time span')[1]
    const nowImg = document.querySelector('.now .situation img')
    const nowSituationText = document.querySelector('.now .situation .text')
    const nowTmp = document.querySelector('.now .temp .tmp')
    const nowFl = document.querySelector('.now .temp .fl')
    const forecastItem1 = document.querySelectorAll('.forecast>div')[0]
    const forecastItem2 = document.querySelectorAll('.forecast>div')[1]
    const forecastItem3 = document.querySelectorAll('.forecast>div')[2]

    const lifestyleItems = document.querySelectorAll('.lifestyle-item')
    const lifestyleTc = document.querySelector('.lifestyle-tc')

    const historyImg = document.querySelector('.history img')
    const history = document.querySelector('.history')
    const historied = document.querySelector('.historied')
    const clearBtn = document.querySelector('.clearBtn')

    // 1.设置时间
    function getTime () {
        const date= new Date()
        const year = date.getFullYear()
        const month = fix(date.getMonth()+1,2)
        const day = fix(date.getDate(),2)
        const hours = fix(date.getHours(),2)
        const minutes = fix(date.getMinutes(),2)
        // 1.1 设置时间格式
        window.dateStr = year+'-'+month+'-'+day+' '+hours+':'+minutes
        timeNode.innerHTML = dateStr
        // 1.2 设施数值显示位数,不足在前面加'0'
        function fix(num,length) {
            return (''+ num).length <length ?
                ((new Array(length + 1)).join('0') + num).slice(-length) :
                '' + num;
        }
    }
    getTime()
    // 2.初始化渲染页面
    // 2.1设置当前地址信息
    let location = '武汉'
    let handle = function () {
        function getNow() {
            return axios.get(`https://free-api.heweather.net/s6/weather/now?location=${location}&key=b1eac8ade8b749bfb154b194a06964a4`)
        }
        function getForecast() {
            return axios.get(`https://free-api.heweather.net/s6/weather/forecast?location=${location}&key=b1eac8ade8b749bfb154b194a06964a4`)
        }
        function getLifestyle() {
            return axios.get(`https://free-api.heweather.net/s6/weather/lifestyle?location=${location}&key=b1eac8ade8b749bfb154b194a06964a4`)
        }

        axios.all([getNow(),getForecast(),getLifestyle()])
            .then(axios.spread(function (now,forecast,lifestyle){

                // 3.now部分
                // console.log(now);
                location = ''
                const basicInformation = now.data.HeWeather6[0].basic
                const nowInformation = now.data.HeWeather6[0].now
                cityNode.innerHTML = basicInformation.location
                nowImg.src = `https://cdn.heweather.com/cond_icon/${nowInformation.cond_code}.png`
                nowSituationText.innerHTML = nowInformation.cond_txt
                nowTmp.innerHTML =' 温度:'+nowInformation.tmp+'℃'
                nowFl.innerHTML = '体感温度:'+nowInformation.fl+'℃'

                // 4.forecast部分
                // console.log(forecast);
                const daily_forecast = forecast.data.HeWeather6[0].daily_forecast
                forecastItem1.innerHTML=`
                  <div class="forecast-situation">
                     <img src="https://cdn.heweather.com/cond_icon/${daily_forecast[0].cond_code_d}.png" alt="">
                     今天 * <span class="txt">${daily_forecast[0].cond_txt_d}转${daily_forecast[0].cond_txt_n}</span>
                  </div>
                  <div class="forecast-temp">
                    <span class="max">${daily_forecast[0].tmp_max}/</span>
                    <span class="min">${daily_forecast[0].tmp_min}</span>
                  </div>`
                forecastItem2.innerHTML=`
                  <div class="forecast-situation">
                     <img src="https://cdn.heweather.com/cond_icon/${daily_forecast[1].cond_code_d}.png" alt="">
                     今天 * <span class="txt">${daily_forecast[1].cond_txt_d}转${daily_forecast[1].cond_txt_n}</span>
                  </div>
                  <div class="forecast-temp">
                    <span class="max">${daily_forecast[1].tmp_max}/</span>
                    <span class="min">${daily_forecast[1].tmp_min}</span>
                  </div>`
                forecastItem3.innerHTML=`
                  <div class="forecast-situation">
                     <img src="https://cdn.heweather.com/cond_icon/${daily_forecast[2].cond_code_d}.png" alt="">
                     今天 * <span class="txt">${daily_forecast[2].cond_txt_d}转${daily_forecast[2].cond_txt_n}</span>
                  </div>
                  <div class="forecast-temp">
                    <span class="max">${daily_forecast[2].tmp_max}/</span>
                    <span class="min">${daily_forecast[2].tmp_min}</span>
                  </div>`

                // 5.lifestyle部分
                console.log(lifestyle)
                const lifestyleInfo = lifestyle.data.HeWeather6[0].lifestyle
                for (let i = 0;i < lifestyleItems.length; i++) {

                    lifestyleItems[i].addEventListener('click',function (){
                        // 开始时将弹窗的隐藏去掉
                        lifestyleTc.style.display = ''
                        lifestyleTc.innerHTML = `
                            <div class="fanghui">
                              <img src="./images/back.png" alt="">
                            </div>
                            <h2>${this.children[1].innerHTML}</h2>
                            <span>${lifestyleInfo[i].brf}</span>
                            <p>${lifestyleInfo[i].txt}</p>
                        `
                        // 给返回绑定点击事件
                        let fanhui = document.querySelector('.fanghui')
                        let fanhuiImg = document.querySelector('.fanghui img')
                        fanhui.onclick = function () {
                            fanhuiImg.src = './images/back2.png'
                            lifestyleTc.style.display ='none'
                        }
                    },false)
                }

                // 6.更新历史记录

                var historyItem = document.createElement('div')
                historyItem.setAttribute('class','history-item')
                historyItem.innerHTML = `
                    <span class="history-time">${dateStr}</span>
                    <span class="history-city">${basicInformation.location}</span>
                `
                if (historied != ''){
                    historied.insertBefore(historyItem,historied.firstChild)
                }else {
                    historied.appendChild(historyItem)
                }

                // 7.当点击历史记录时跳转至相应的天气界面
                for (let i = 0; i < historied.children.length;i++) {
                    historied.children[i].onclick = function () {
                        // 7.1更新location
                        location = historied.children[i].children[1].innerHTML
                        console.log(location)
                        // 7.2重新调用handle函数
                        handle()
                    }
                }

                // 8.清除历史记录
                clearBtn.onclick = function (){
                    historied.innerHTML = ''
                }

                // 9.展开与收缩历史查询部分
                historyImg.addEventListener('click',function (){
                    if (history.style.height == '0.5rem'){
                        historyImg.style.background = 'rgb(129,126,129)'
                        history.style.height = '3rem'
                    }else {
                        historyImg.style.background = ''
                        history.style.height = '0.5rem'
                    }
                    // console.log('dianjile')

                },false)

            }))
            .catch(function (error){
                console.log(error)
            })
    }
    handle()

    // 10.点击搜索之后的操作
    searchBtn.addEventListener('click',function (){
        // 10.1.获取当前搜索的地区
        location = searchNode.value
        // console.log(location)
        // 10.2 重新渲染页面
        handle()
    },false)


}