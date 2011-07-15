/*  
	@author veera
	@url veerasundar.com
*/
var slidr = {
    currentSlideId: 1,
    init: function () {
        $("#add").bind("click", slidr.addSlide);
        $("#delete").bind("click", slidr.deleteSlide);
        $("#next").bind("click", slidr.nextSlide);
        $("#prev").bind("click", slidr.prevSlide);
        $("#panelSwitch").bind("click", slidr.togglePanel);
        $("article").removeClass("activeSlide").addClass("hiddenSlide");
        $("article:first").removeClass("hiddenSlide").addClass("activeSlide");
        slidr.currentSlideId = $(".activeSlide").attr("id");
        slidr.align();
        $("header").css("margin-top", -32);
        slidr.togglePanel();
    },
    align: function () {
        var numOfSlides = $("article").size();
        var currentSlide = $("article:first");
        var slideLeft = 100;
        for (var i = 1; i <= numOfSlides; i++) {
            $(currentSlide).css("left", slideLeft + "px");
            slideLeft = parseInt($(currentSlide).css("left")) + parseInt($(currentSlide).css("width")) + 100;
            currentSlide = $(currentSlide).next("article");
        }
    },
    addSlide: function () {
        var lastSlideId = parseInt($("article:last").attr("id"));
        var crntid = parseInt(slidr.currentSlideId);
        for (i = lastSlideId; i > crntid; i--) {
            $("#" + i).attr("id", i + 1);
        }
        var newSlideLeft = parseInt($("#" + crntid).css("left"));
        var newSlideId = crntid + 1;
        var newSlide = "<article contenteditable='true' id='" + newSlideId + "'><h1>Click to edit title</h1><ul><li>Click to edit</li></ul></article>";
        var firstSlideId = parseInt($("article:first").attr("id"));
        for (i = firstSlideId; i <= crntid; i++) {
            slidr.moveSlide(i, "backward");
            $("#" + i).removeClass("activeSlide").addClass("hiddenSlide");
        }
        $("#" + crntid).after(newSlide);
        $("#" + newSlideId).css("left", newSlideLeft);
        $("#" + newSlideId).addClass("activeSlide");
        slidr.currentSlideId = newSlideId;
    },
    deleteSlide: function () {
        if ($("article").size() == 1) {
            alert("Sorry! You can not delete when there's only one slide. Try adding more slides, before deleting this one.");
            return;
        }
        var crntid = parseInt(slidr.currentSlideId);
        $("#" + crntid).remove();
        var lastSlideId = parseInt($("article:last").attr("id"));
        for (i = lastSlideId; i > crntid; i--) {
            $("#" + i).attr("id", i - 1);
        }
        var firstSlideId = parseInt($("article:first").attr("id"));
        if (firstSlideId == crntid) {
            for (i = crntid; i <= parseInt($("article:last").attr("id")); i++) {
                slidr.moveSlide(i, "backward");
            }
            $("#" + (crntid)).removeClass("hiddenSlide").addClass("activeSlide");
            slidr.currentSlideId = crntid;
        } else {
            for (i = firstSlideId; i < crntid; i++) {
                slidr.moveSlide(i, "forward");
            }
            $("#" + (crntid - 1)).removeClass("hiddenSlide").addClass("activeSlide");
            slidr.currentSlideId = crntid - 1;
        }
    },
    moveSlide: function (id, direction) {
        var slide = $("#" + id);
        var currentLeft = parseInt($(slide).css("left"));
        var newLeft;
        if (direction == "forward") {
            newLeft = currentLeft + parseInt($(slide).css("width")) + 100;
        } else {
            newLeft = currentLeft - parseInt($(slide).css("width")) - 100;
        }
        $(slide).animate({
            left: newLeft + "px"
        });
    },
    nextSlide: function () {
        if ($(".activeSlide").next("article").size() == 0) {
            alert("No (more) slides to go!");
            return;
        }
        var currentSlide, tempLeft;
        var numOfSlides = $("article").size();
        for (var i = 1; i <= numOfSlides; i++) {
            slidr.moveSlide(i, "backward");
        }
        currentSlide = $(".activeSlide");
        $(currentSlide).removeClass("activeSlide").addClass("hiddenSlide");
        $(currentSlide).next("article").removeClass("hiddenSlide").addClass("activeSlide");
        slidr.currentSlideId = $(".activeSlide").attr("id");
    },
    prevSlide: function () {
        if ($(".activeSlide").prev("article").size() == 0) {
            alert("No (more) slides to go!");
            return;
        }
        var currentSlide, tempLeft;
        var numOfSlides = $("article").size();
        for (var i = 1; i <= numOfSlides; i++) {
            slidr.moveSlide(i, "forward");
        }
        currentSlide = $(".activeSlide");
        $(currentSlide).removeClass("activeSlide").addClass("hiddenSlide");
        $(currentSlide).prev("article").removeClass("hiddenSlide").addClass("activeSlide");
        slidr.currentSlideId = $(".activeSlide").attr("id");
    },
    keyHandler: function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 39 || code == 34) {
            e.preventDefault();
            slidr.nextSlide();
        } else {
            if (code == 37 || code == 33) {
                e.preventDefault();
                slidr.prevSlide();
            }
        }
    },
    togglePanel: function () {
        var newMargin = 0;
        var panelMargin = parseInt($("header").css("margin-top"));
        if (panelMargin == 0) {
            newMargin = -32;
            $("article").attr("contenteditable", "false");
            $("#panelSwitch").html("Edit Slides");
            $(document).bind("keyup", slidr.keyHandler);
            $(document).focus();
        } else {
            newMargin = 0;
            $("article").attr("contenteditable", "true");
            $("#panelSwitch").html("Done editing");
            $(document).unbind("keyup", slidr.keyHandler);
            $(document).focus();
        }
        $("header").animate({
            marginTop: newMargin + "px"
        }, 200);
    },
};
$(document).ready(function () {
    slidr.init();
});
