/**
 * Created by NE_LEADER on 2015. 10. 5..
 */

angular
    .module('honeyqa')
    .controller('mainCtrl', mainCtrl)
    .controller('emailCtrl', emailCtrl)



function mainCtrl($scope) {
    //$('#page-wrapper').removeClass('nav-small');
}

function emailCtrl($scope) {
    if (!$('#page-wrapper').hasClass('nav-small')) {
        $('#page-wrapper').addClass('nav-small');
    }
}

angular
    .module('honeyqa')
    .controller('project_list_profile', project_list_profile)
    .controller('project_list_load_project', project_list_load_project)

function project_list_profile($scope, $http) {
    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/user/2'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))


        if(data.image_path == "./images/user_profiles/noimage.jpg") {
            $scope.profile_pic = 'img/default_pic.jpg';
        }
        else {
            $scope.profile_pic = data.image_path;
        }
        $scope.nickname = data.nickname;

    }, function errorCallback(response) {
        console.log('error :' + response);
    });
}

function project_list_load_project($scope, $http) {
    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/projects/2'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))

        for(var i = 0; i < data.projects.length; i++) {
            if(data.projects[i].platform == 1) {
                data.projects[i].platform = 'Android';
            }
            else if(data.projects[i].platform == 2) {
                data.projects[i].platform = 'iOS';
            }
            else if(data.projects[i].platform == 3) {
                data.projects[i].platform = 'Unity';
            }
            else if(data.projects[i].platform == 4) {
                data.projects[i].platform = 'Cordova';
            }
            else if(data.projects[i].platform == 5) {
                data.projects[i].platform = 'Javascript';
            }
        }
        $scope.pr = data.projects;

    }, function errorCallback(response) {
        console.log('error :' + response);
    });
}


angular
    .module('honeyqa')
    .controller('overview_weekly_error', overview_weekly_error)
    .controller('overview_most_session_app_ver', overview_most_session_app_ver)
    .controller('overview_most_error_app_ver', overview_most_error_app_ver)
    .controller('overview_most_error_device', overview_most_error_device)
    .controller('overview_most_error_sdk', overview_most_error_sdk)
    .controller('overview_most_error_country', overview_most_error_country)
    .controller('overview_most_error_class', overview_most_error_class)

function overview_weekly_error($scope, $http) {
    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/weekly_appruncount'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))

        for(var i = 0; i < data.weekly.length; i++) {
            var temp = data.weekly[i].date + "";
            temp = temp.replace('-', '')
            temp = temp.replace('-', '')
            data.weekly[i].date = temp;
        }

        var init = {
                data: [
                    [ parseInt(data.weekly[0].date), data.weekly[0].error_count],
                    [ parseInt(data.weekly[1].date), data.weekly[1].error_count],
                    [ parseInt(data.weekly[2].date), data.weekly[2].error_count],
                    [ parseInt(data.weekly[3].date), data.weekly[3].error_count],
                    [ parseInt(data.weekly[4].date), data.weekly[4].error_count],
                    [ parseInt(data.weekly[5].date), data.weekly[5].error_count],
                    [ parseInt(data.weekly[6].date), data.weekly[6].error_count]
                ],
                label: "Error"
            },
            options = {
                series: {
                    lines: {
                        show: true,
                        fill: true,
                        fillColor: 'rgba(121,206,167,0.2)'
                    },
                    points: {
                        show: true,
                        radius: '4.5'
                    }
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },
                colors: ["#37b494"],
                xaxis: {
                    minTickSize : 1,
                    tickFormatter: function (val, axis) {
                        return val;
                    }
                }
            },
            plot;

        plot = $.plot($('#placeholder'), [init], options);

        $("#placeholder").bind("plotclick", function (event, pos, item) {
            if (item) {
                $("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
                plot.highlight(item.series, item.datapoint);
            }
        });

        var animate = function () {
            $('#placeholder').animate( {tabIndex: 0}, {
                duration: 3000,
                step: function ( now, fx ) {
                    var r = $.map( init.data, function ( o ) {
                        return [[ o[0], o[1] * fx.pos ]];
                    });
                    plot.setData( [{ data: r }] );
                    plot.draw();
                }
            });
        }
        animate();

    }, function errorCallback(response) {
        console.log('error :' + response);
    });
}

function overview_most_session_app_ver($scope, $http) {

    var counting = 0;
    var total;

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/most/sessionbyappver'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));
        if(data.count != '0')
            counting = data.count;

        if(data.appversion != 'unknown')
            $scope.appversion = data.appversion;
        else
            $scope.appversion = 'No Data';

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/weekly_sessioncount'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))
        total = data.weekly_sessioncount;
        $scope.percent = parseInt((counting / total) * 100);
        if(isNaN($scope.percent))
            $scope.percent = 0;

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $scope.options = {
        barColor: '#8bc34a',
        trackColor: '#f2f2f2',
        scaleColor: false,
        lineWidth: 8,
        size: 130,
        animate: 1500,
        onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    };
}

function overview_most_error_app_ver($scope, $http) {

    var counting;
    var total;

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/most/errorbyappver'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))

        counting = data.count;

        $scope.appversion = data.appversion;


    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/weekly_errorcount'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));
        total = data.weekly_instancecount;

        $scope.percent = parseInt((counting / total) * 100);

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $scope.options = {
        barColor: '#e84e40',
        trackColor: '#f2f2f2',
        scaleColor: false,
        lineWidth: 8,
        size: 130,
        animate: 1500,
        onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    };
}

function overview_most_error_device($scope, $http) {

    var counting;

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/most/errorbydevice'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));

        $scope.device_name = data.device;
        counting = data.count;
        $scope.device_count = data.count;

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/weekly_errorcount'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))
        $scope.width = parseInt((counting / data.weekly_instancecount) * 100) + '%';

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}

function overview_most_error_sdk($scope, $http) {
    var counting;

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/most/errorbysdkversion'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))

        $scope.sdk_level = data.osversion;
        counting = data.count;
        $scope.sdk_count = data.count;

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/weekly_errorcount'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))

        $scope.width = parseInt((counting / data.weekly_instancecount) * 100) + '%';

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}

function overview_most_error_country($scope, $http) {
    var counting;

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/most/errorbycountry'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))


        $scope.country_name = data.country;
        counting = data.count;
        $scope.country_count = data.count;

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/weekly_errorcount'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))

        $scope.width = parseInt((counting / data.weekly_instancecount) * 100) + '%';

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}

function overview_most_error_class($scope, $http) {

    var counting;

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/most/errorbyclassname'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))

        if(data.lastactivity == '') {
            $scope.class_name = 'unknown class';
        }
        else
            $scope.class_name = data.lastactivity;
        counting = data.count;
        $scope.class_count = data.count;

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/weekly_errorcount'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data))

        $scope.width = parseInt((counting / data.weekly_instancecount) * 100) + '%';

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}


angular
    .module('honeyqa')
    .controller('errors_filter_list', errors_filter_list)
    .controller('errors_recommend_error_list', errors_recommend_error_list)


function errors_filter_list($scope, $http) {
    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/filters2'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));


        if(data.filter_appversions[0].appversion == '0') {
            $scope.app_filter_first = '1';
        }
        else { $scope.app_filter_first = data.filter_appversions[0].appversion; }

        if(data.filter_appversions[1].appversion == '0') {
            $scope.app_filter_second = '2';
        }
        else { $scope.app_filter_second = data.filter_appversions[1].appversion; }

        if(data.filter_appversions[2].appversion == '0') {
            $scope.app_filter_third = '3';
        }
        else { $scope.app_filter_third = data.filter_appversions[2].appversion; }

        if(data.filter_appversions[3].appversion == '0') {
            $scope.app_filter_fourth = '4';
        }
        else { $scope.app_filter_fourth = data.filter_appversions[3].appversion; }

        //$scope.app_filter_first_width = '300px';


        // DEVICE
        if(data.filter_devices[0].device == '0') {
            $scope.device_filter_first = '1';
        }
        else { $scope.device_filter_first = data.filter_devices[0].device; }

        if(data.filter_devices[1].device == '0') {
            $scope.device_filter_second = '2';
        }
        else { $scope.device_filter_second = data.filter_devices[1].device; }

        if(data.filter_devices[2].device == '0') {
            $scope.device_filter_third = '3';
        }
        else { $scope.device_filter_third = data.filter_devices[2].device; }

        if(data.filter_devices[3].device == '0') {
            $scope.device_filter_fourth = '4';
        }
        else { $scope.device_filter_fourth = data.filter_devices[3].device; }



        //SDK LEVEL
        if(data.filter_sdkversions[0].osversion == '0') {
            $scope.sdk_filter_first = '';
        }
        else { $scope.sdk_filter_first = data.filter_sdkversions[0].osversion; }

        if(data.filter_sdkversions[1].osversion == '0') {
            $scope.sdk_filter_second = '';
        }
        else { $scope.sdk_filter_second = data.filter_sdkversions[1].osversion; }

        if(data.filter_sdkversions[2].osversion == '0') {
            $scope.sdk_filter_third = '3';
        }
        else { $scope.sdk_filter_third = data.filter_sdkversions[2].osversion; }

        if(data.filter_sdkversions[3].osversion == '0') {
            $scope.sdk_filter_fourth = '4';
        }
        else { $scope.sdk_filter_fourth = data.filter_sdkversions[3].osversion; }


        //Country
        if(data.filter_countries[0].country == '0') {
            $scope.country_filter_first = '1';
        }
        else { $scope.country_filter_first = data.filter_countries[0].country; }

        if(data.filter_countries[1].country == '0') {
            $scope.country_filter_second = '2';
        }
        else { $scope.country_filter_second = data.filter_countries[1].country; }

        if(data.filter_countries[2].country == '0') {
            $scope.country_filter_third = '3';
        }
        else { $scope.country_filter_third = data.filter_countries[2].country; }

        if(data.filter_countries[3].country == '0') {
            $scope.country_filter_fourth = '4';
        }
        else { $scope.country_filter_fourth = data.filter_countries[3].country; }

        // category
        // 0 : Period
        // 1 : Rank
        // 2 : App version
        // 3 : Device
        // 4 : SDK Level
        // 5 : Country

        var filter_query_period = -1;
        var filter_query_rank = new Array(6);
        var filter_query_app = new Array(5);
        var filter_query_device = new Array(5);
        var filter_query_sdk = new Array(5);
        var filter_query_country = new Array(5);


        //init
        filter_query_rank[5] = 0;
        for(var i = 0; i < 5; i++) {
            filter_query_rank[i] = 0; //rank는 -1빼고 json에 push
            filter_query_app[i] = 0;
            filter_query_device[i] = 0;
            filter_query_sdk[i] = 0;
            filter_query_country[i] = 0;
        }
        filter_query_rank[0] = -1;
        filter_query_app[0] = -1;
        filter_query_device[0] = -1;
        filter_query_sdk[0] = -1;
        filter_query_country[0] = -1;

        $scope.set_filter = function (category, selecting, value) {
            if(category == 0) {
                filter_query_period = value;
            }
            else if(category == 1) {
                if(filter_query_rank[selecting] == 0) {
                    filter_query_rank[selecting] = value;
                    filter_query_rank[0] = 0;
                }
                else
                    filter_query_rank[selecting] = 0;

                if(selecting == 0) {
                    filter_query_rank[0] = -1;
                    filter_query_rank[1] = 0;
                    filter_query_rank[2] = 0;
                    filter_query_rank[3] = 0;
                    filter_query_rank[4] = 0;
                    filter_query_rank[5] = 0;
                }

            }
            else if(category == 2) {
                if(filter_query_app[selecting] == 0) {
                    filter_query_app[selecting] = value;
                    filter_query_app[0] = 0;
                }
                else
                    filter_query_app[selecting] = 0;

                if(selecting == 0) {
                    filter_query_app[0] = -1;
                    filter_query_app[1] = 0;
                    filter_query_app[2] = 0;
                    filter_query_app[3] = 0;
                    filter_query_app[4] = 0;
                }

            }
            else if(category == 3) {
                if(filter_query_device[selecting] == 0) {
                    filter_query_device[selecting] = value;
                    filter_query_device[0] = 0;
                }
                else
                    filter_query_device[selecting] = 0;

                if(selecting == 0) {
                    filter_query_device[0] = -1;
                    filter_query_device[1] = 0;
                    filter_query_device[2] = 0;
                    filter_query_device[3] = 0;
                    filter_query_device[4] = 0;
                }
            }
            else if(category == 4) {
                if(filter_query_sdk[selecting] == 0) {
                    filter_query_sdk[selecting] = value;
                    filter_query_sdk[0] = 0;
                }
                else
                    filter_query_sdk[selecting] = 0;

                if(selecting == 0) {
                    filter_query_sdk[0] = -1;
                    filter_query_sdk[1] = 0;
                    filter_query_sdk[2] = 0;
                    filter_query_sdk[3] = 0;
                    filter_query_sdk[4] = 0;
                }
            }
            else if(category == 5) {
                if(filter_query_country[selecting] == 0) {
                    filter_query_country[selecting] = value;
                    filter_query_country[0] = 0;
                }
                else
                    filter_query_country[selecting] = 0;

                if(selecting == 0) {
                    filter_query_country[0] = -1;
                    filter_query_country[1] = 0;
                    filter_query_country[2] = 0;
                    filter_query_country[3] = 0;
                    filter_query_country[4] = 0;
                }
            }

            //var json_filter = [];
            var json_filter = [
                { Rank : [] },
                { Appver : [] },
                { Device : [] },
                { SDK : [] },
                { Country : [] }
            ];

            json_filter.push({ period : filter_query_period });

            if(filter_query_rank[0] == -1) {
                json_filter[0].Rank.push(-1);
            }
            else {
                for(var i = 1; i < 6; i++) {
                    if(filter_query_rank[i] != 0) {
                        json_filter[0].Rank.push(filter_query_rank[i] - 1);
                    }
                }
            }

            if(filter_query_app[0] == -1) {
                json_filter[1].Appver.push(-1);
            }
            else {
                for(var i = 1; i < 5; i++) {
                    if(filter_query_app[i] != 0) {
                        json_filter[1].Appver.push(filter_query_app[i]);
                    }
                }
            }

            if(filter_query_device[0] == -1) {
                json_filter[2].Device.push(-1);
            }
            else {
                for(var i = 1; i < 5; i++) {
                    if(filter_query_device[i] != 0) {
                        json_filter[2].Device.push(filter_query_device[i]);
                    }
                }
            }

            if(filter_query_sdk[0] == -1) {
                json_filter[3].SDK.push(-1);
            }
            else {
                for(var i = 1; i < 5; i++) {
                    if(filter_query_sdk[i] != 0) {
                        json_filter[3].SDK.push(filter_query_sdk[i]);
                    }
                }
            }

            if(filter_query_country[0] == -1) {
                json_filter[4].Country.push(-1);
            }
            else {
                for(var i = 1; i < 5; i++) {
                    if(filter_query_country[i] != 0) {
                        json_filter[4].Country.push(filter_query_country[i]);
                    }
                }
            }


            console.log('json_filter : ' + JSON.stringify(json_filter));


            //$http({
            //    method: 'POST',
            //    data: JSON.stringify(json_filter),
            //    url: 'https://honeyqa.io:8080/project/3/errors_filtered',
            //    headers: {'Content-Type': 'application/json'}
            //}).then(function successCallback(response) {
            //    var data = JSON.parse(JSON.stringify(response.data));
            //    console.log('data : ' + JSON.stringify(data));
            //
            //}, function errorCallback(response) {
            //    console.log('error : ' + response);
            //});

            //$.ajax({
            //    type: "POST",
            //    url: 'https://honeyqa.io:8080/project/3/errors_filtered',
            //    data : json_filter,
            //    datatype: "JSON",
            //    contentType: "application/json; charset=utf-8",
            //    error: function(returndata) {
            //        console.log('error' + returndata);
            //    },
            //    success: function (returndata) {
            //        console.log('success' + returndata);
            //    }
            //});

        }

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}



function errors_recommend_error_list($scope, $http, $location) {
    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/project/720/errors'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));


        for(var i = 0; i < data.errors.length; i++) {
            if(data.errors[i].rank == 0) {
                data.errors[i].rank = 'Unhandle';
            }
            else if(data.errors[i].rank == 1) {
                data.errors[i].rank = 'Native';
            }
            else if(data.errors[i].rank == 2) {
                data.errors[i].rank = 'Critical';
            }
            else if(data.errors[i].rank == 3) {
                data.errors[i].rank = 'Major';
            }
            else if(data.errors[i].rank == 4) {
                data.errors[i].rank = 'Minor';
            }
        }

        $scope.errors = data.errors;


    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $scope.insight_error_click_route = function(error_id){
        var detail_path = '/detail/' + error_id;
        $location.path(detail_path);
    }


    $scope.setting_css = function(rank) {
        if(rank == 'Unhandle') {
            return 'label label-warning pull-left';
        }
        else if(rank == 'Native') {
            return 'label label-success pull-left';
        }
        else if(rank == 'Critical') {
            return 'label label-danger pull-left';
        }
        else if(rank == 'Major') {
            return 'label label-primary pull-left';
        }
        else if(rank == 'Minor') {
            return 'label label-primary pull-left';
        }
    }
}


angular
    .module('honeyqa')
    .controller('error_detail_load', error_detail_load)

function error_detail_load($scope, $http, $routeParams) {
    var errorid = $routeParams.error_id;

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/error/' + errorid
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));

        $scope.error_full_name = data.errorname;
        $scope.error_class_name = data.errorclassname;
        $scope.createdate = data.create_date;
        $scope.updatedate = data.update_date;
        $scope.error_count = data.numofinstances;
        $scope.stat = data.status;
        $scope.wifi_count = parseFloat((data.wifion / data.numofinstances) * 100).toFixed(2) + '%';
        $scope.mobile_network_count = parseFloat((data.mobileon / data.numofinstances).toFixed(2) * 100) + '%';
        $scope.gps_count = parseFloat((data.gpson / data.numofinstances).toFixed(2) * 100) + '%';
        $scope.memory_usage = parseInt(data.totalmemusage / 1024) + 'MB';

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/error/' + errorid + '/tags'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));
        $scope.taglist = data;

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/error/' + errorid + '/callstack'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));

        //$scope.stack = data.spilt("n");

        var string_change = data.callstack + "";

        var stack = string_change.split('\n\t');

        var json_return = [];
        for(var z = 0; z < stack.length; z++) {
            for(var i = 0; i < stack[z].length; i++) {
                if(stack[z][i] == '(') {
                    json_return.push({
                        stack_name: stack[z].substring(0, i - 1),
                        stack_source : stack[z].substring(i)
                    });
                }
            }
        }

        $scope.cs = json_return;

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/error/' +  + errorid + '/statistics'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));

        graphDonut = Morris.Donut({
            element: 'error_app_ver_donut',
            data: [
                {label : data.appversion_counts[0].appversion, value : data.appversion_counts[0].count },
                {label : data.appversion_counts[1].appversion, value : data.appversion_counts[1].count }
            ],
            colors: ['#8bc34a', '#ffc107', '#e84e40', '#03a9f4', '#9c27b0', '#90a4ae'],
            formatter: function (y) { return y},
            resize: true
        })

        graphDonut = Morris.Donut({
            element: 'error_device_donut',
            data: [
                {label : data.device_counts[0].device, value : data.device_counts[0].count },
                {label : data.device_counts[1].device, value : data.device_counts[1].count }
            ],
            colors: ['#8bc34a', '#ffc107', '#e84e40', '#03a9f4', '#9c27b0', '#90a4ae'],
            formatter: function (y) { return y},
            resize: true
        })

        graphDonut = Morris.Donut({
            element: 'error_sdk_level_donut',
            data: [
                {label : data.sdkversion_counts[0].osversion, value : data.sdkversion_counts[0].count },
                {label : data.sdkversion_counts[1].osversion, value : data.sdkversion_counts[1].count }
            ],
            colors: ['#8bc34a', '#ffc107', '#e84e40', '#03a9f4', '#9c27b0', '#90a4ae'],
            formatter: function (y) { return y},
            resize: true
        })

        graphDonut = Morris.Donut({
            element: 'error_country_donut',
            data: [
                {label : data.country_counts[0].country, value : data.country_counts[0].count },
                {label : data.country_counts[1].country, value : data.country_counts[1].count }
            ],
            colors: ['#8bc34a', '#ffc107', '#e84e40', '#03a9f4', '#9c27b0', '#90a4ae'],
            formatter: function (y) { return y},
            resize: true
        })


    }, function errorCallback(response) {
        console.log('error : ' + response);
    });





    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/error/' +  + errorid + '/instances'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));

       $scope.insts = data;;

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}




angular
    .module('honeyqa')
    .controller('insight_rank_rating', insight_rank_rating)

function insight_rank_rating($scope, $http) {

    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/statistics/60/rank_rate'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));

        //console.log('Unhandle : ' + data[0].count);
        //console.log('Native : ' + data[1].count);
        //console.log('Critical : ' + data[2].count);
        //console.log('Major : ' + data[3].count);
        //console.log('Minor : ' + data[4].count);

        var value_array = new Array(5);
        for(var i = 0; i < 5; i++) {
            value_array[i] = 0;
        }

        for(var i = 0; i < data.length; i++) {
            value_array[data[i].rank] = data[i].count;
        }


        graphDonut = Morris.Donut({
            element: 'insight_rank_rate',
            data: [
                {label: 'Unhandled', value: value_array[0] },
                {label: 'Native', value: value_array[1] },
                {label: 'Critical', value: value_array[2] },
                {label: 'Major', value: value_array[3] },
                {label: 'Minor', value: value_array[4] }
            ],
            colors: ['#8bc34a', '#ffc107', '#e84e40', '#03a9f4', '#9c27b0', '#90a4ae'],
            formatter: function (y) { return y + "%" },
            resize: true
        });


    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}


angular
    .module('honeyqa')
    .controller('statistic_appver_most_session', statistic_appver_most_session)
    .controller('statistic_appver_most_error', statistic_appver_most_error)


function statistic_appver_most_session($scope, $http) {
    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/statistics/720/session_appversion'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));

        var av_most_session = data.values;
        var keys_name_array = new Array(data.keys.length);

        for(var i = 0; i < data.keys.length; i++) {
            keys_name_array[i] = data.keys[i];
        }

        graphArea2 = Morris.Area({
            element: 'statistic_appver_most_session_area',
            data : av_most_session,
            lineColors: ['#0288d1', '#607d8b', '#689f38', '#8e44ad', '#c0392b', '#f39c12'],
            xkey: 'datetime',
            ykeys: keys_name_array,
            labels: keys_name_array,
            pointSize: 2,
            hideHover: 'auto',
            resize: true
        });

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}

function statistic_appver_most_error($scope, $http) {
    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/statistics/720/error_appversion'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));

        var av_most_session = data.values;
        var keys_name_array = new Array(data.keys.length);

        for(var i = 0; i < data.keys.length; i++) {
            keys_name_array[i] = data.keys[i];
        }

        graphArea2 = Morris.Area({
            element: 'statistic_appver_most_error_area',
            data : av_most_session,
            lineColors: ['#0288d1', '#607d8b', '#689f38', '#8e44ad', '#c0392b', '#f39c12'],
            xkey: 'datetime',
            ykeys: keys_name_array,
            labels: keys_name_array,
            pointSize: 2,
            hideHover: 'auto',
            resize: true
        });

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}


angular
    .module('honeyqa')
    .controller('statistic_device_error_rating', statistic_device_error_rating)
    .controller('statistic_device_circle_repeat', statistic_device_circle_repeat)
    .controller('statistic_device_circle', statistic_device_circle)


function statistic_device_error_rating($scope, $http) {
    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/statistics/720/device'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));


        //console.log('data : ' + data[0].device);
        //console.log('data : ' + data[0].count);

        graphBar = Morris.Bar({
            element: 'statistic_device_error_rate',
            data: data,
            barColors: ['#8bc34a', '#e84e40', '#f39c12', '#3fcfbb', '#626f70', '#8f44ad'],
            xkey: 'device',
            ykeys: ['count'],
            labels: ['Count'],
            barRatio: 0.4,
            xLabelAngle: 35,
            hideHover: 'auto',
            resize: true
        });

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}

function statistic_device_circle_repeat($scope, $http) {
    $http({
        method: 'GET',
        url: 'https://honeyqa.io:8080/statistics/720/device'
    }).then(function successCallback(response) {
        var data = JSON.parse(JSON.stringify(response.data));

        $scope.circle = data;

    }, function errorCallback(response) {
        console.log('error : ' + response);
    });
}

function statistic_device_circle($scope, $http) {

        $(".knob").knob({
            readOnly : true,
            change : function (value) {
                console.log("change : " + value);
            },
            release : function (value) {
                //console.log(this.$.attr('value'));
                console.log("release : " + value);
            },
            cancel : function () {
                console.log("cancel : ", this);
            },
            draw : function () {

                // "tron" case
                if(this.$.data('skin') == 'tron') {

                    var a = this.angle(this.cv)  // Angle
                        , sa = this.startAngle		  // Previous start angle
                        , sat = this.startAngle		 // Start angle
                        , ea							// Previous end angle
                        , eat = sat + a				 // End angle
                        , r = 1;

                    this.g.lineWidth = this.lineWidth;

                    //this.o.cursor
                    //&& (sat = eat - 0.3)
                    //&& (eat = eat + 0.3);

                    //if (this.o.displayPrevious) {
                    //    ea = this.startAngle + this.angle(this.v);
                    //    this.o.cursor
                    //    && (sa = ea - 0.3)
                    //    && (ea = ea + 0.3);
                    //    this.g.beginPath();
                    //    this.g.strokeStyle = this.pColor;
                    //    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                    //    this.g.stroke();
                    //}

                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                    this.g.stroke();

                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();
                    return false;
                }
            }
        });

}



function dashboardFlotCtrl($scope) {
    var data1 = [
        [gd(2015, 1, 1), 838], [gd(2015, 1, 2), 749], [gd(2015, 1, 3), 634], [gd(2015, 1, 4), 1080], [gd(2015, 1, 5), 850], [gd(2015, 1, 6), 465], [gd(2015, 1, 7), 453], [gd(2015, 1, 8), 646], [gd(2015, 1, 9), 738], [gd(2015, 1, 10), 899], [gd(2015, 1, 11), 830], [gd(2015, 1, 12), 789]
    ];

    var data2 = [
        [gd(2015, 1, 1), 342], [gd(2015, 1, 2), 721], [gd(2015, 1, 3), 493], [gd(2015, 1, 4), 403], [gd(2015, 1, 5), 657], [gd(2015, 1, 6), 782], [gd(2015, 1, 7), 609], [gd(2015, 1, 8), 543], [gd(2015, 1, 9), 599], [gd(2015, 1, 10), 359], [gd(2015, 1, 11), 783], [gd(2015, 1, 12), 680]
    ];

    var series = new Array();

    series.push({
        data: data1,
        bars: {
            show : true,
            barWidth: 24 * 60 * 60 * 12000,
            lineWidth: 1,
            fill: 1,
            align: 'center'
        },
        label: 'Revenues'
    });
    series.push({
        data: data2,
        color: '#e84e40',
        lines: {
            show : true,
            lineWidth: 3,
        },
        points: {
            fillColor: "#e84e40",
            fillColor: '#ffffff',
            pointWidth: 1,
            show: true
        },
        label: 'Orders'
    });

    $.plot("#graph-bar", series, {
        colors: ['#03a9f4', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#95a5a6'],
        grid: {
            tickColor: "#f2f2f2",
            borderWidth: 0,
            hoverable: true,
            clickable: true
        },
        legend: {
            noColumns: 1,
            labelBoxBorderColor: "#000000",
            position: "ne"
        },
        shadowSize: 0,
        xaxis: {
            mode: "time",
            tickSize: [1, "month"],
            tickLength: 0,
            // axisLabel: "Date",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Open Sans, sans-serif',
            axisLabelPadding: 10
        }
    });

    var previousPoint = null;
    $("#graph-bar").bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {

                previousPoint = item.dataIndex;

                $("#flot-tooltip").remove();
                var x = item.datapoint[0],
                    y = item.datapoint[1];

                showTooltip(item.pageX, item.pageY, item.series.label, y );
            }
        }
        else {
            $("#flot-tooltip").remove();
            previousPoint = [0,0,0];
        }
    });
}

function device_range() {
    //range slider
    $('.slider-range').noUiSlider({
        range: [1, 30],
        start: [10, 15],
        step: 1,
        connect: true,
        slide: function(){
            var values = $(this).val();

            $(this).next('span').text(
                'Term range: ' + values[0] + ' - ' + values[1]
            );
        },
        set: function(){
            var values = $(this).val();

            $(this).next('span').text(
                'Term range: ' + values[0] + ' - ' + values[1]
            );
        }
    });
    $('.slider-range').val([10, 15], true);
}



function device_morris_circle() {
    $(".knob").knob({
        change : function (value) {
            //console.log("change : " + value);
        },
        release : function (value) {
            //console.log(this.$.attr('value'));
            console.log("release : " + value);
        },
        cancel : function () {
            console.log("cancel : ", this);
        },
        draw : function () {

            // "tron" case
            if(this.$.data('skin') == 'tron') {

                var a = this.angle(this.cv)  // Angle
                    , sa = this.startAngle		  // Previous start angle
                    , sat = this.startAngle		 // Start angle
                    , ea							// Previous end angle
                    , eat = sat + a				 // End angle
                    , r = 1;

                this.g.lineWidth = this.lineWidth;

                this.o.cursor
                && (sat = eat - 0.3)
                && (eat = eat + 0.3);

                if (this.o.displayPrevious) {
                    ea = this.startAngle + this.angle(this.v);
                    this.o.cursor
                    && (sa = ea - 0.3)
                    && (ea = ea + 0.3);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }
    });
}

function sdk_flot_donut() {
    // donut chart
    if ($('#graph-flot-donut').length) {
        var dataDonut = [
            { label: "3.0",  data: 10},
            { label: "4.0.2",  data: 30},
            { label: "4.1",  data: 90},
            { label: "4.2",  data: 70},
            { label: "5.0.1",  data: 80},
            { label: "6.0",  data: 110}
        ];

        $.plot('#graph-flot-donut', dataDonut, {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.5,
                    label: {
                        show: true,
                    }
                }
            },
            colors: ['#e84e40', '#ffc107', '#8bc34a', '#03a9f4', '#9c27b0', '#90a4ae'],
            legend: {
                show: false,
            }
        });
    }
}

function sdk_flot_bar() {
    graphBar = Morris.Bar({
        element: 'sdk-flot-bar',
        data: [
            {x: '3.0', y: 3, z: 2, a: 3},
            {x: '4.0.2', y: 3, z: 2, a: 3},
            {x: '4.1', y: 3, z: 2, a: 3},
            {x: '4.2', y: 3, z: 2, a: 3},
            {x: '5.0.1', y: 2, z: null, a: 1},
            {x: '6.0', y: 0, z: 2, a: 4},
        ],
        barColors: ['#8bc34a', '#ffc107', '#e84e40', '#03a9f4', '#9c27b0', '#90a4ae'],
        xkey: 'x',
        ykeys: ['y', 'z', 'a'],
        labels: ['Y', 'Z', 'A'],
        resize: true
    });
}

function country_map() {
    //WORLD MAP
    $('#world-map-example').vectorMap({
        map: 'world_merc_en',
        backgroundColor: '#ffffff',
        zoomOnScroll: false,
        regionStyle: {
            initial: {
                fill: '#e1e1e1',
                stroke: 'none',
                "stroke-width": 0,
                "stroke-opacity": 1
            },
            hover: {
                "fill-opacity": 0.8
            },
            selected: {
                fill: '#8dc859'
            },
            selectedHover: {
            }
        },
        markerStyle: {
            initial: {
                fill: '#e84e40',
                stroke: '#e84e40'
            }
        },
        markers: [
            {latLng: [38.35, -121.92], name: 'Los Angeles - 23'},
            {latLng: [39.36, -73.12], name: 'New York - 84'},
            {latLng: [50.49, -0.23], name: 'London - 43'},
            {latLng: [36.29, 138.54], name: 'Tokyo - 33'},
            {latLng: [37.02, 114.13], name: 'Beijing - 91'},
            {latLng: [-32.59, 150.21], name: 'Sydney - 22'},
        ],
        series: {
            regions: [{
                values: gdpData,
                scale: ['#6fc4fe', '#2980b9'],
                normalizeFunction: 'polynomial'
            }]
        },
        onRegionLabelShow: function(e, el, code){
            el.html(el.html()+' ('+gdpData[code]+')');
        }
    });
}

function class_flot_donut() {
    // donut chart
    if ($('#class_flot_donut').length) {
        var dataDonut = [
            { label: "3.0",  data: 10},
            { label: "4.0.2",  data: 30},
            { label: "4.1",  data: 90},
            { label: "4.2",  data: 70},
            { label: "5.0.1",  data: 80},
            { label: "6.0",  data: 110}
        ];

        $.plot('#class_flot_donut', dataDonut, {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.5,
                    label: {
                        show: true,
                    }
                }
            },
            colors: ['#e84e40', '#ffc107', '#8bc34a', '#03a9f4', '#9c27b0', '#90a4ae'],
            legend: {
                show: false,
            }
        });
    }
}


function proguardList($scope, $http) {
}

function dsymList($scope, $http) {
}
