(function () {

    "use strict";

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    // H E L P E R    F U N C T I O N S
    //
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    /**
     * Function to check if we clicked inside an element with a particular class
     * name.
     * 
     * @param {Object} e The event
     * @param {String} className The class name to check against
     * @return {Boolean}
     */
    function clickInsideElement(e, className) {
        var el = e.srcElement || e.target;

        if (el.classList.contains(className)) {
            return el;
        } else {
            while (el = el.parentNode) {
                if (el.classList && el.classList.contains(className)) {
                    return el;
                }
            }
        }

        return false;
    }

    /**
     * Get's exact position of event.
     * 
     * @param {Object} e The event passed in
     * @return {Object} Returns the x and y position
     */
    function getPosition(e) {
        var posx = 0;
        var posy = 0;

        if (!e) var e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    // C O R E    F U N C T I O N S
    //
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    /**
     * Variables.
     */
    var contextMenuClassName = "context-menu";
    var contextMenuItemClassName = "context-menu__item";
    var contextMenuLinkClassName = "context-menu__link";
    var contextMenuActive = "context-menu-active";
    var contextSubMenuActive = "context-submenu-active"; // Blat

    var taskItemClassName = "task";
    var taskItemInContext;

    var clickCoords;
    var clickCoordsX;
    var clickCoordsY;

    var menu = document.querySelector("#context-menu");
    var menuItems = menu.querySelectorAll(".context-menu__item");
    var menuState = 0;
    var menuWidth;
    var menuHeight;
    var menuPosition;
    var menuPositionX;
    var menuPositionY;

    var submenu = document.querySelectorAll(".context-submenu"); // Blat
    var submenuParent = document.querySelector(".context-submenu__link"); // Blat
    var submenuState = 0;
    var submenuWidth;
    var submenuHeight;

    var currentLink;
    var currentLinkCheck;

    var windowWidth;
    var windowHeight;

//    var closeDelay = 120000;  // 2 min - use for delay within hover and mouse abandoned (WIP)
    var idleClose = true;
    var idleCloseDelay = 5000; // max wait for first CM hover event

    /**
     * Initialise our application's code.
     */
    function init() {
        contextListener();
        clickListener();
        keyupListener();
        resizeListener();
        hoverListener(); // Blat
    }

    /**
     * Listens for contextmenu events.
     */
    function contextListener() {
        document.addEventListener("contextmenu", function (e) {

            idleClose = true;  // set false by cm hover event and 0 gates the menu off functions
            setTimeout(function() {
                toggleMenuOff(0);
                toggleSubMenuOff(0);
            }, idleCloseDelay);

            taskItemInContext = clickInsideElement(e, taskItemClassName);

            if (taskItemInContext) {
                e.preventDefault();
                toggleMenuOn();
                positionMenu(e);
        //        setTimeout(function() {
        //            toggleSubMenuOff();
        //            toggleMenuOff();
        //        }, closeDelay);

            } else {   // clicked outside task lines - don't want context menu
                taskItemInContext = null;
                toggleMenuOff(1);
            }
        });
    }

    /**
     * Listens for click events.
     */
    function clickListener() {
        document.addEventListener("click", function (e) {

            var clickedElIsLink = clickInsideElement(e, contextMenuLinkClassName);
            if(!e.target.className.match(/context-menu__link-disabled/)) {

                if (clickedElIsLink) {
                    e.preventDefault();
                    menuItemListener(clickedElIsLink);
                } else {
                    var button = e.which || e.button;
                    if (button === 1) {
                        toggleMenuOff(1);
                        toggleSubMenuOff(1);
                    }
                }
            }
        });
    }

    /**
     * Listens for hover events. (Blat)
     */
    function hoverListener() {


        var el = document.getElementById('context-menu');

        el.addEventListener("mouseover", function (e) {

            idleClose = false;

            if(!e.target.className.match(/context-menu__link-disabled/)) {
                var matcho = e.target.className;
                var clear = document.querySelectorAll('.context-submenu__link');
                clear.forEach(classo => {
                    classo.classList.remove('submenuActive'); // remove link highlighting
                })

                if (submenuState != 1) { // need to cater for case of icons within link hovered
                    toggleSubMenuOff(1);
                }

                // check for submenu required       
                if (matcho.match(/context-submenu__link/)) {
                    e.preventDefault();
                    currentLinkCheck = e.target.getAttribute('data-action');

                    if (currentLinkCheck != currentLink) {
                        toggleSubMenuOff(1);
                    }
                    var obbo = e.target.offsetParent;
                    var cw = e.target.offsetParent.clientWidth;
                    var ch = e.target.offsetParent.clientHeight;
                    var sm = e.srcElement.dataset.action;
                    var classo = 'context-submenu__link';

                    clear.forEach(classo => {
                        if (classo.getAttribute("data-action") == sm) {
                            classo.classList.add('submenuActive');
                        }
                    })

                    toggleMenuOn();
                    toggleSubMenuOn(obbo, sm);

                    currentLinkCheck = e.target.getAttribute('data-action');
                    currentLink = currentLinkCheck; // store current link so if link changes submenu can be closed and reopened

                } else { // no submenu required

                    var test = e.target.classList;

                    if (!test.value.match(/fa/) && submenuState == 1) { // don't do if icons of submenu link are hovered
                        submenuParent.classList.remove('submenuActive');
                        toggleSubMenuOff(1);
                    }
                }
            }    
        });
    }

    /**
     * Listens for menu leave events. (Blat)
     */
     // need to cater for leaving CM and SM directly and transition between CM and SM
    var cmLeave = document.getElementById('context-menu');
    cmLeave.addEventListener("mouseleave", function (e) {
        e.preventDefault();
        var smCheck = false;
        var checko = document.getElementById('context-submenu');
        checko.addEventListener("mouseover", function (e) {
            smCheck = true;
        })
        setTimeout(function() {
            if(!smCheck) {
                toggleMenuOff(1);
                toggleSubMenuOff(1);
            }
        }, 10);
    })

    var smLeave = document.getElementById('context-submenu');
    smLeave.addEventListener("mouseleave", function (e) {
        e.preventDefault();
        var smCheck = false;
        var checko = document.getElementById('context-menu');
        checko.addEventListener("mouseover", function (e) {
            smCheck = true;
        })
        setTimeout(function() {
            if(!smCheck) {
                toggleMenuOff(1);
                toggleSubMenuOff(1);
            }
        }, 10);
    })

    /**
     * Listens for keyup events.
     */
    function keyupListener() {
        window.onkeyup = function (e) {
            if (e.keyCode === 27) {
                toggleMenuOff(1);
            }
        }
    }

    /**
     * Window resize event listener
     */
    function resizeListener() {
        window.onresize = function (e) {
            toggleMenuOff(1);
        };
    }

    /**
     * Turns the custom context menu on.
     */
    function toggleMenuOn() {
        if (menuState !== 1) {
            menuState = 1;
            menu.classList.add(contextMenuActive);
        }
    }

    /**
     * Turns the custom context menu off.
     */
    function toggleMenuOff(num) {
        if ((menuState !== 0) && (num == 1)) {
            menuState = 0;
            menu.classList.remove(contextMenuActive);
        }
        if ((idleClose) && (num == 0)) {
            menuState = 0;
            menu.classList.remove(contextMenuActive);
        }    
    }

    /**
     * Turns the custom context submenu on.
     */
//    function toggleSubMenuOn(sm) {
    function toggleSubMenuOn(obbo, sm) {
        if (submenuState !== 1) {
            submenuState = 1;
            var which = document.getElementById(sm)
            which.classList.add(contextSubMenuActive);
            positionSubMenu(obbo, sm);
        }
    }

    /**
     * Turns the custom context submenu off.
     */
    function toggleSubMenuOff(num) {
        if ((submenuState !== 0) && (num == 1)) {

            setTimeout(function() {   // avoid remnant link highlight from previous click when CM exited
                var remnant = document.querySelector('.submenuActive');
                if(remnant != null) {
                    remnant.classList.remove('submenuActive');
                }
            }, 10);
            
            submenuState = 0;
            var closeSubmenu = document.querySelector(".context-submenu-active");
            closeSubmenu.classList.remove(contextSubMenuActive);
        }
    }

    /**
     * Positions the menu properly.
     * 
     * @param {Object} e The event
     */
    function positionMenu(e) {
        clickCoords = getPosition(e);
        clickCoordsX = clickCoords.x;
        clickCoordsY = clickCoords.y;

        menuWidth = menu.offsetWidth + 4;
        menuHeight = menu.offsetHeight + 4;

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        if ((windowWidth - clickCoordsX) < menuWidth) {
            menu.style.left = windowWidth - menuWidth + "px";
        } else {
            menu.style.left = clickCoordsX + "px";
        }

        if ((windowHeight - clickCoordsY) < menuHeight) {
            menu.style.top = windowHeight - menuHeight + "px";
        } else {
            menu.style.top = clickCoordsY + "px";
        }
    }

    /**
     * Positions the submenu properly.  // Blat
     * 
     * @param {Object} e The event
     */
    function positionSubMenu(e, sm) {

        var smCoordsX = e.offsetLeft + e.offsetWidth;
        // needs to alter depending on which item
        var tempo = sm.replace('sm', '');
//        var submenuOffsetHeight = 22 * tempo;
        var submenuOffsetHeight = 25 * tempo;
        var smCoordsY = e.offsetTop + submenuOffsetHeight;
        var smCurrent = document.getElementById(sm);

        submenuWidth = smCurrent.clientWidth + 4;
        submenuHeight = smCurrent.clientHeight + 4;

        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        if ((windowWidth - smCoordsX) < menuWidth) {
            // submenu moved to left side
            var tempo = windowWidth - (menuWidth + submenuWidth - 4);
            var adjuster = windowWidth - (e.offsetLeft + menuWidth);
            smCurrent.style.left = windowWidth - (menuWidth + submenuWidth - 4) - adjuster + 2 + "px";  // 2 needed for 12 rounded style links transition - SM CM slight overlap.
        } else {
            // submenu on right side (normal)
            smCurrent.style.left = smCoordsX + "px";
        }

        if ((windowHeight - smCoordsY) < menuHeight) {
            smCurrent.style.top = windowHeight - submenuHeight - 4 + "px";
        } else {
            smCurrent.style.top = smCoordsY + "px";
        }
    }

    /**
     * Dummy action function that logs an action when a menu item link is clicked
     * 
     * @param {HTMLElement} link The link that was clicked
     */
    function menuItemListener(link) {
        console.log("Task ID - " + taskItemInContext.getAttribute("data-id") + ", Task action - " + link.getAttribute("data-action"));

        var da = link.getAttribute("data-action")
        if(da != 'TOGGLEICON') {
            toggleMenuOff(0);
            toggleSubMenuOff(0);
        }

        // example of icon changing for menu item (Click Piggy)
        var tempo = link.firstChild.classList;

        if(tempo.value.match(/fa-chain-broken/)) {
            tempo.remove('fa-chain-broken');
            tempo.add('fa-chain');
        } else {
            tempo.remove('fa-chain');
            tempo.add('fa-chain-broken');
        }

    }


    /**
     * Run the app.
     */
    init();

})();
