(function () {

	"use strict"
	// 增加模块

	var $addBtn = $('div.addBtn'),
		$maskBac = $('div.bak-mask'),
		$updateBtn = $('input.update-btn'),
		bool = false,
		bool2 = '',
		list_index = 0,
		dateArr = [],
		
		$inputTitle, $inputContants, $inputTime,
		//要获取用户的值
		dateTimePiacker = $('input[name="time"]').datetimepicker(),//设置日期插件
		dome_User = $('.warpper .container ul');

	var modleDiv = function (myId, data, dateTitle) {

		var str = "<li data-index =" + myId + "><div class='line-Left'>"
			+ "<input class = 'classCheck' name='check' type='checkbox' " +(data.complete?"checked":"") + ">" +
			"<p class = 'classTitle' >" + dateTitle + "</p><span class = 'timeRun_P'>已经完成提醒！</span></div>"
			+ "<div class='line-Right'><span class='deletDom'>删除</span><span class='updateDom'>修改</span></div></li>"
		return $(str);
	}
	init()

	function init() {
		console.log('开始初始化');
		ramazher_list()
	}

	function ramazher_list() {
		//console.log(store.get('date_list'));

		if (!store.get('date_list')) {
			return;
		} else {
			dateArr = store.get('date_list');
			var allDomList = dome_User.children();
			var completeArr = [];
			console.log(allDomList.length);
			for (var j = 0; j < allDomList.length; j++) {
				if (allDomList.eq(j)[0].timer) {
					clearInterval(allDomList.eq(j)[0].timer);
				}

			}

			dome_User.html(null);
			for (var i = 0; i < dateArr.length; i++) {
				if(dateArr[i].complete){
					completeArr.push(dateArr[i]);

				}else{
					var licpl = modleDiv(i, dateArr[i], dateArr[i].inputTitle);
					dome_User.append(licpl);
					timerRun(licpl, dateArr[i]);
				}
			
			}

			for(var k = 0;k<completeArr.length;k++){
				var licpl = modleDiv(k,  completeArr[k], completeArr[k].inputTitle);
				//licpl.attr('checked',true);
				licpl.attr('id', 'complate');
				dome_User.append(licpl);
			}

			deletDom();
			updateDome();
			complete();

		}
	}
	$addBtn.click(function () {
		bool2 = 'insert';
		if (!bool) {
			$maskBac.show();
			bool = true;
		}
	})

	$maskBac.click(function (e) {
		if (e.target.className == 'bak-mask' && bool) {
			$(this).hide();
			bool = false;
		}

	})



	//init();//初始化开始



	$updateBtn.click(function (e) {

		//判断是否为更新 或者 插入
		if (bool2 == 'insert') {

			//获取数据插入部分
			$inputTitle = $('input.input-Title').val();
			$inputContants = $('textarea[name="txtinput"]').val();
			$inputTime = dateTimePiacker.val();
			//var $newDiv = modleDiv('', '', $inputTitle);
			var datejSON = {};
			datejSON.inputTitle = $inputTitle;
			datejSON.inputContants = $inputContants;
			datejSON.inputTimes = $inputTime;



			
			//dome_User.append($newDiv);
			list_index = Number(dateArr.length - 1);
			addStore(datejSON)

			//	timerRun(dateArr, list_index);
			bool2 = '';
			console.log('insert' + list_index);


		} else {
			var datejSON = {};
			datejSON.inputTitle = $('input.input-Title').val();
			datejSON.inputContants = $('textarea[name="txtinput"]').val();
			datejSON.inputTimes = dateTimePiacker.val();


			$.extend(dateArr[list_index], datejSON);

			console.log(dateArr[list_index]);
			store.set('date_list', dateArr);
			dome_User.find('p.classTitle').eq(list_index).html(dateArr[list_index].inputTitle);

			console.log('update');
			ramazher_list();



		}

		if (bool) {
			$maskBac.hide();
			bool = false;
		}


		return false;
	})

	//更新数组与locoStorage
	function updateArr(index,date) {
		if(index==undefined || !dateArr[index] ){
			return
		}
		dateArr[index] = $.extend(dateArr[index],date);
		console.log(dateArr)
		store.set('date_list', dateArr);

		ramazher_list();


	}
//更新数组与添加数据
	function addStore(date) {
	
		dateArr.push(date)
		console.log(dateArr)
		store.set('date_list', dateArr);
		ramazher_list();


	}



	//插入定时模块

	function timerRun(itme, date) {

		console.log(itme.eq(0)[0]);
		var item = itme.eq(0)[0];
		console.log(date.inputContants);



		var currTimer = new Date(date.inputTimes).getTime();
		var nowTimer = new Date().getTime();
		var chaTime = Math.floor((currTimer - nowTimer) / 1000);

		console.log(chaTime);
		if (chaTime > 1) {

			item.timer = setInterval(function () {

				chaTime--;
				if (chaTime < 0) {

					clearInterval(item.timer);
					//alert('ok');
					$('.remind_box').animate({top:0},500,function(){
						var video = $(this).find('.videoRun').eq(0)[0];
						video.play();
						$('.myCall_conts').html(date.inputContants);
						$(this).find('.remind_btn').click(function(){
							video.pause();
							$(this).parent().parent().animate({top:-100},500);
							var index = $(item).data('index');
							updateArr(index,{complete:true});

						})
					});
					
	

				} else {
					$(itme).find('.timeRun_P').html('还剩' + chaTime + '秒');
				}


			}, 1000)

		}
	}


function pop(str){

    if(!str){
        console.error('str is ont definde');
    }

    var dfd = $.Deferred(),
        runDfd ,
        comfirmd  ,
        $comfirm = $('button.confirm'),
        $cancel =$('button.cancel');

        $comfirm.click(function(){
            comfirmd = true;
            console.log(comfirmd);
        });
        
        $cancel.click(function(){
            comfirmd = false;
            clearInterval(runDfd);
            $('.mask_judge').hide();

        });
        runDfd = setInterval(function (){

            if(comfirmd != undefined || comfirmd ==true){
            clearInterval(runDfd);
            dfd.resolve(comfirmd);
              console.log('循环停止');
            }


        },50);

        return dfd.promise();

}

	//删除模块
	function deletDom() {
		var list_dele = $('.deletDom');
		list_dele.on('click', function () {
            var listDelet = $(this).parent().parent();
           var ListiIndex = listDelet.data('index');
             $('.mask_judge').show();
            pop("确定要删除吗？").then(function(res){
                console.log(ListiIndex);
                if(res){
                    $('.mask_judge').hide();
                    dateArr.splice(ListiIndex, 1);
                    store.set('date_list', dateArr);
                    ramazher_list();
                }
              //  res ? deleItem(ListiIndex):null;
               
            })
	         
			return false;
		})
	}

    // function deleItem(index){
    //         console.log(index);
    //         dateArr.splice(ListiIndex, 1);
    //         console.log(dateArr)
    //         store.set('date_list', dateArr);
    //         ramazher_list();
    // }
	//更新功能
	function updateDome() {

		var list_update = $('.updateDom');

		list_update.on('click', function () {

			var listupdate = $(this).parent().parent();
			var ListiIndex = listupdate.data('index');
			console.log(ListiIndex);
			updateDomFn(ListiIndex);
			return false;


		})

	}

	function updateDomFn(index) {
		list_index = index;
		//var storyN = store.get('date_list');
		//console.log(list_index);
		//storyN = storyN.reverse();
		$inputTitle = dateArr[list_index].inputTitle;
		$inputContants = dateArr[list_index].inputContants;
		$inputTime = dateArr[list_index].inputTimes;
		$('input.input-Title').val($inputTitle);
		$('textarea[name="txtinput"]').val($inputContants);
		$('input[name="time"]').val($inputTime);

		if (!bool) {
			$maskBac.show();
			bool = true;
			bool2 = '';
		}
		return false;
	}



//完成部分
function complete(){

	var checkList = dome_User.find('input[name="check"]');

	checkList.on('change',function(){
		var $this =  $(this)
		var index = $this.parent().parent().data('index');
		console.log(index)
		if(!dateArr[index].complete){
			//dateArr[index].complete = true;
			updateArr(index,{complete:true});
			console.log(dateArr[index]);
		}else{
			//dateArr[index].complete = false;
			updateArr(index,{complete:false})
		}
		
		return false;
	})


}


})();




