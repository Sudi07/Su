//jQuery  prototype 项目start
var notifyObject = {
    $addBtn: $('div.addBtn'),
    $back_mask: $('.back_mask'),
    bool: false,
    lock_change: "",
    task_index: 0,
    dataArr: [],   
    dask_list: $('.warpper .container ul'),
    dateTimePiacker: $('input[name="time"]').datetimepicker(),
    //currDateArr_list :[],
    init: function () {
        this.refurbish();
        this.bindEvent();
    },
    bindEvent: function () {
        //绑定事件
        //this.$addBtn.on('click', $.proxy(notifyObject,"showbackEdite"));
        //通过$.proxy的方法改变proxy的指向;与下面写法一样；
        this.$addBtn.on('click', $.proxy(this.showbackEdite, this));
        this.$back_mask.on('click', $.proxy(this.hidebackEdite, this));
        $('.update-btn').on('click', $.proxy(this.submint_dask, this));
    },
    edit_task_List: function (e) {

        var currTargetIndex = $(e.target).parent().parent().data('index');
        // console.log(currTargetIndex);
        this.dask_edit_tpl(currTargetIndex);
        this.showbackEdite();
        this.lock_change = "lock";

    },
    delet_dask_list: function (e) {
        var self = this;
        var currTargetIndex = $(e.target).parent().parent().data('index');
        console.log(currTargetIndex);
        $('.mask_judge').show();
        this.pop("确定要删除吗？").then(function (res) {
            console.log(currTargetIndex);
            if (res) {
                $('.mask_judge').hide();
                // console.log(self.dataArr);
                self.dataArr.splice(currTargetIndex, 1);
                self.saveStoreFn();
            }
            //  res ? deleItem(ListiIndex):null;

        })

    },
    dask_edit_tpl: function (index) {

        var dateArr = this.dataArr[index];
        this.task_index = index;
        $('.input-Title').val(dateArr.inputTitle);
        $('.input-contants').val(dateArr.inputContants);
        $('.input-Time').val(dateArr.inputTime);

    },
    saveStoreFn: function () {
        store.set('user_list', this.dataArr);
        this.refurbish();
        $('.input-Title').val(null);
        $('.input-contants').val(null);
        $('.input-Time').val(null);
    },
    submint_dask: function (e) {
        //  添加一个 
        console.log(this.lock_change);
        if (this.lock_change != 'lock') {
            var currDate = {};
            currDate.inputTitle = $('.input-Title').val();
            currDate.inputContants = $('.input-contants').val();
            currDate.inputTime = $('.input-Time').val();
            this.dataArr.push(currDate);
            console.log(this.dataArr);
            this.saveStoreFn();


        } else {
            console.log("edit");
            //  修改一个  
            var currIndex = this.task_index;
            this.dataArr[currIndex].inputTitle = $('.input-Title').val();
            this.dataArr[currIndex].inputContants = $('.input-contants').val();
            this.dataArr[currIndex].inputTime = $('.input-Time').val();
            this.saveStoreFn();

        }

        if (this.bool) {
            this.$back_mask.hide();
            this.bool = false;
        }
        return false;
    },
    refurbish: function () {
        if (!store.get('user_list')) {
            return false;
        } else {
            this.dataArr = store.get('user_list');
            var dataArr = this.dataArr;
            var complateArr = [];
            var dast_list = this.dask_list.children();  //清除定时器
            for (var j = 0; j < dast_list.length; j++) {
                if (dast_list.eq(j)[0].timer) {
                    clearInterval(dast_list.eq(j)[0].timer);
                }

            }
            this.dask_list.html(null);
            for (var i = 0; i < dataArr.length; i++) {

                if (dataArr[i].complate) {
                    complateArr.push(dataArr[i]);
                } else {
                    var currList = this.tpl_task_li(i, dataArr[i]);
                    this.dask_list.append(currList);
                    this.timeRun(currList, dataArr[i]);
                }
            }

            for (var k = 0; k < complateArr.length; k++) {
                var compalt_List = this.tpl_task_li(k, complateArr[k]);
                compalt_List.attr('id', "complate");
                this.dask_list.append(compalt_List);
            }

        }
        $('.updateDom').on('click', $.proxy(this.edit_task_List, this));
        $('.deletDom').on('click', $.proxy(this.delet_dask_list, this));
        $('.classCheck').on('change', $.proxy(this.complateCall, this));

    },
    complateCall: function (e) {

        console.log('p');
        var currTargetIndex = $(e.target).parent().parent().data('index');
        if (!this.dataArr[currTargetIndex].complate) {
            this.extendDate(currTargetIndex, { complate: true });
        } else {
            this.extendDate(currTargetIndex, { complate: false });
        }

    },
    extendDate: function (index, newDate) {
        //console.log(index);
        if (index == undefined || !this.dataArr[index]) {
            return
        }
        this.dataArr[index] = $.extend(this.dataArr[index], newDate);
        this.saveStoreFn();


    },
    tpl_task_li: function (index, data) {

        var str = "<li data-index =" + index + "><div class='line-Left'>" +
            "<input class = 'classCheck' name='check' type='checkbox' " + (data.complate ? 'checked' : '') + ">" +
            "<p class = 'classTitle' >" + data.inputTitle + "</p>" +
            " <p class = 'timeRun_P'>提醒已经完成！ </p></div>" +
            " <div class='line-Right'><span class='deletDom'>Delet</span><span class='updateDom'>编辑</span>" +
            " </div> </li>";
        return $(str);

    }
    ,
    showbackEdite: function () {
        if (!this.bool) {
            this.$back_mask.show();
            this.bool = true;
            this.lock_change = "";
        }
    },
    hidebackEdite: function (e) {
        if (e.target.className == 'back_mask' && this.bool) {
            this.$back_mask.hide();
            this.bool = false;
        }
        //  return false;
    },
    pop: function (str) {

        if (!str) {
            console.error('str is ont definde');
        }

        var dfd = $.Deferred(),
            runDfd,
            comfirmd,
            $comfirm = $('button.confirm'),
            $cancel = $('button.cancel');

        $comfirm.click(function () {
            comfirmd = true;
        });

        $cancel.click(function () {
            comfirmd = false;
            clearInterval(runDfd);
            $('.mask_judge').hide();

        });
        runDfd = setInterval(function () {

            if (comfirmd != undefined || comfirmd == true) {
                clearInterval(runDfd);
                dfd.resolve(comfirmd);
                console.log('循环停止');
            }

        }, 50);

        return dfd.promise();
    },
    //计时器开始工作
    timeRun: function (obj, data) {
        var self = this;
        var obj_timer = new Date(data.inputTime).getTime(),
            currTimer = new Date().getTime(),
            diffenetTime = Math.floor((obj_timer - currTimer) / 1000);

        var currList = obj.eq(0)[0];
        // console.log(currList);
        if (diffenetTime > 1) {
            currList.timer = setInterval(function () {
                diffenetTime--;
                if (diffenetTime < 0) {
                    clearInterval(currList.timer);

                    //完成事件
                    $('.remind_box').animate({ top: 0 }, 500, function () {
                        var video = $(this).find('.videoRun').eq(0)[0]; //$(this).find('.videoRun').get(0)相当于取到原生dom了
                        video.play();
                        $('.myCall_conts').html(data.inputContants);
                        $(this).find('.remind_btn').click(function () {
                            video.pause();
                            $(this).parent().parent().animate({ top: -100 }, 500);
                            //console.log(this);
                            var index = obj.data('index');
                            self.extendDate(index, { complate: true });
                        })
                    });

                    // self.extendDate(index, { complate: true });

                } else {
                    obj.find(".timeRun_P").html('还剩余' + diffenetTime + '秒');
                }

            }, 1000)

        }


    }

}


notifyObject.init();


