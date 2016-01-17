;
$(function(){

    window.Templates = {};

    var templatesLoader = new TemplatesLoader({
        urls:[
            "templates/about.html",
            "templates/beautySalon.html",
            "templates/contacts.html",
            "templates/discounts.html",
            "templates/gallery.html",
            "templates/home.html",
            "templates/menu.html",
            "templates/reservation.html",
            "templates/roomPagination.html",
            "templates/roomPaginationControl.html",
            "templates/spaCenter.html"
        ],
        storage:window.Templates,
        onAllLoaded:initApp
    });

    templatesLoader.start();

function initApp() {


    $.getJSON("JSON/mainMenuCategories.json", function (data) {
        $('.mainMenuWrapper').html(Templates.menu({categories: data}));
    }).fail(function (e, status) {
        console.log("failed to load JSON for menu");
    });

    window.Timers = {};

    var contentContainerController = new ContainerController({
        container: ".main",
        onContentChange: function () {
            UsefulFunctions.scrollToTop();
        }
    });

    var route = new Route({
        routes: {
            'about': function () {
                contentContainerController.setContent(Templates.about());
            },
            'discounts': function () {
                contentContainerController.setContent(Templates.discounts());
            },
            'gallery': function () {
                var images = [];
                for (var i = 1; i < 15; i++) {
                    images.push({
                        src: 'img/gallery/' + i + '.jpg',
                        alt: 'gallery room photo'
                    })
                }

                contentContainerController.setContent(Templates.gallery(
                    {
                        images: images
                    }
                ));
                var gallery = new Gallery('.gallery');
                gallery.init();
            },
            'home': function () {
                if (window.Timers.sliderTimer !== undefined) {
                    clearInterval(window.Timers.sliderTimer);
                }
                contentContainerController.setContent(Templates.home());

                //init slider
                var slideWidth = $('.slider').width(),
                    $sliderWrapper = $('.slider .wrapper'),
                    slidesCount = $sliderWrapper.children().size(),
                    current,
                    sliderChangeTime = 4000,
                    sliderAnimationDuration = 500;

                $sliderWrapper.width(slidesCount * slideWidth);
                $sliderWrapper.hover(function () {
                    clearInterval(window.Timers.sliderTimer);
                    delete window.Timers.sliderTimer;
                }, function () {

                    window.Timers.sliderTimer = setInterval(next, sliderChangeTime);
                });

                function next() {
                    current = parseInt($sliderWrapper.attr('data-currentSlide'));
                    if (++current >= slidesCount) {
                        current = 0;
                    }
                    $sliderWrapper.attr('data-currentSlide', current);

                    $('.slider .wrapper').animate({left: -current * slideWidth}, sliderAnimationDuration);
                }

                window.Timers.sliderTimer = setInterval(next, sliderChangeTime);

            },
            'spaCenter': function () {
                contentContainerController.setContent(Templates.spaCenter());
            },
            'beautySalon': function () {
                contentContainerController.setContent(Templates.beautySalon());
            },
            'contacts': function () {
                contentContainerController.setContent(Templates.contacts());
            },
            'reservation': function () {
                contentContainerController.setContent(Templates.reservation());

                var roomsPagination = new PaginateData({
                    dataInRow: 4,
                    dataContainerSelector: ".reservation .roomsContainer",
                    dataTemplate: Templates.roomPagination,
                    controlContainerSelector: ".reservation .paginationControl",
                    controlTemplate: Templates.roomPaginationControl,
                    filters: {
                        all: function (data) {
                            return data.filter(function (elem) {
                                return true;
                            });
                        },
                        occupied: function (data) {
                            return data.filter(function (elem) {
                                return elem.occupied >= parseInt(elem.totalCount);
                            });
                        },
                        available: function (data) {
                            return data.filter(function (elem) {
                                return elem.occupied < parseInt(elem.totalCount);
                            });
                        },
                        fromTo: function (data, options) {
                            return data.filter(function (elem) {
                                var from = true, to = true;
                                if (options.from.length != 0) {
                                    from = parseFloat(elem.price) >= parseFloat(options.from);
                                }
                                if (options.to.length != 0) {
                                    to = parseFloat(elem.price) <= parseFloat(options.to);
                                }
                                return from && to;
                            });
                        }
                    },
                    onRender: function () {
                        $('.roomContainer').click(function (e) {
                            if ($(e.target).hasClass('buy')) {
                                alert('Данные отправлены на сервер, id номера : ' + $(this).attr('data-roomId'));
                                //ajax request
                            }
                        });
                    }
                });

                function applyFilters() {
                    var filter1 = ($('.reservation .filters input[name="filterGroup1"]:checked').prop('id')),
                        from = $('.reservation .filters #fromPrice').val(),
                        to = $('.reservation .filters #toPrice').val();

                    roomsPagination.filter(filter1);
                    if (to.length > 0 || from.length > 0) {
                        roomsPagination.filter('fromTo', {
                            from: from,
                            to: to
                        });
                    }
                    roomsPagination.render();
                }


                //For items displaying without DB connection  you should comment code below, and uncomment code under "CODE FOR ROOMS DISPLAYING WITHOUT DB CONNECTION" comment
                $.get("backend/getData.php", function (data) {
                    if (typeof data === 'string' && data.search('/^<?php/i') !== -1) {
                        console.log(data);
                    }
                    roomsPagination.setData(data);
                    roomsPagination.render();
                    $('.reservation .filters').on('change', applyFilters);
                }, 'json').fail(function (e) {
                    console.log(e);
                    roomsPagination.$dataContainer.html('Ошибка сервера');
                });


                //CODE FOR ROOMS DISPLAYING WITHOUT DB CONNECTION
/*
                 var dataSample = [];
                 for(var i=1;i<15;i++){
                     var roomObj = {
                     id:i,
                     description:"Room #"+i+" description placeholder",
                     imageUrl:"img/gallery/"+i+".jpg",
                     occupied:Math.random()<0.3?3:0,
                     price:100*i,
                     title:"Room #"+i,
                     totalCount:3
                     };
                     dataSample.push(roomObj);
                 }
                 roomsPagination.setData(dataSample);
                 roomsPagination.render();
*/

            }
        },
        onEveryHashCange: function () {
            //none
        }
    });
    route.init();
        $(window).trigger('hashchange')
}

    var hideClassName = 'hide',
        $regForm = $('.registrationFormContainer'),
        $registrationFormLink = $('.registration');

    function formClickHandler(e) {
        if (this == e.target) {
            hideForm();
        }
    }

    function hideForm() {
        $regForm.toggleClass(hideClassName);
        $regForm.off('click', formClickHandler);
    }

    $registrationFormLink.click(function (e) {
        $regForm.on('click', formClickHandler);
        $regForm.toggleClass(hideClassName);
    });

    var $registrationForm = $('.registrationForm');
    $('.registrationForm form').on('submit', function (e) {
        var valid = true,
            errorMessage = '',
            login = $registrationForm.find('.login').val(),
            password = $registrationForm.find('.password').val(),
            confirmPassword = $registrationForm.find('.confirmPassword').val(),
            email = $registrationForm.find('.email').val();

        var emailRegExp = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", 'i');

        if (!emailRegExp.test(email)) {
            valid = false;
            if (errorMessage.length === 0) {
                errorMessage = "Неверноый формат e-mail";
            }
        }

        if (password !== confirmPassword) {
            valid = false;
            if (errorMessage.length === 0) {
                errorMessage = "Пароли не совпадают";
            }
        }

        if (!valid) {
            alert(errorMessage);
        } else {
            var loginObj = {
                login: login,
                email: email,
                password: password
            };

            $.post("backend/addData.php", {
                    data: {
                        "inputObject": loginObj,
                        "functionName": "addUser"
                    }
                }, function (data) {
                    if (data.search(/^<\?php/i) !== -1) {
                        alert('Сайт запущен не на сервере, результат запроса - php код');
                    }
                    alert('Регистрационная форма отправлена');
                    hideForm();
                })
                .fail(function (e, status) {
                    alert('Ошибка сервера');
                    console.log('error', error, 'status', status);
                });
        }
        e.preventDefault();
    }.bind(this));

});




