/*===============================================================================
************   Fast Clicks   ************
===============================================================================*/
app.initFastClicks = function () {
    if (!$.supportTouch) return;
    var touchStartX, touchStartY, touchStartTime, targetElement, trackClick, activeSelection;

    function targetNeedsFocus(el) {
        var tag = el.nodeName.toLowerCase();
        var tags = ['textarea', 'select'];
        var skipInputs = ('button checkbox file image radio submit').split(' ');
        if (el.disabled || el.readOnly) return false;
        if (tag === 'textarea' || tag === 'select') return true;
        if (tag === 'input' && skipInputs.indexOf(el.type) < 0) return true;
    }
    function handleTouchStart(e) {
        if (e.targetTouches.length > 1) {
            return true;
        }
        if (app.device.os === 'ios') {
            var selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                activeSelection = true;
                return true;
            }
        }
        trackClick = true;
        targetElement = e.target;
        touchStartTime = (new Date()).getTime();
        touchStartX = e.targetTouches[0].pageX;
        touchStartY = e.targetTouches[0].pageY;
        
    }
    function handleTouchMove(e) {
        if (!trackClick) return;
        trackClick = false;
        targetElement = null;
    }
    function handleTouchEnd(e) {
        if (!trackClick) {
            if (!activeSelection) e.preventDefault();
            return true;
        }
        e.preventDefault();

        var touchEndTime = (new Date()).getTime();
        trackClick = false;

        // Trigger focus where required
        if (targetNeedsFocus(targetElement)) targetElement.focus();

        // Trigger click
        var touch = e.changedTouches[0];
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        
        targetElement.dispatchEvent(evt);
        // $(targetElement).trigger('click');
    }
    function handleClick(e) {
        
    }
    $(document).on('touchstart', handleTouchStart);
    $(document).on('touchmove', handleTouchMove);
    $(document).on('touchend', handleTouchEnd);
    $(document).on('click', handleClick);
    
};