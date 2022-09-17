# Custom Context Menu

First iteration on creating a custom context menu inside a dummy task application. Full working demo [here](http://codepen.io/callmenick/pen/xbaWdB).


## Fork Note

This fork of Custom-Context-Menu implements a pseudo native MacOS style with a single-level submenu feature.
Primarily intended for desktop app scenarios the links to resources (eg: font-awesome) are now local to allow offline use.
May be suitable for use with apps developed with Neutralino/Tauri/Wails with primary focus on using the Safari webview for Mac apps.
The code tries to give the look & feel of the native interface but is not the same - for example MacOS implements a background color matching effect for menus which this code does not.

Note: Background color matching was tried using the RGBa opacity method but was not suitable since whilst the color does shift the reduced opacity will show artifacts of background layers - the feature needs some way of sampling the average color of the background and then applying it to the Context Menu background.

The demo above is for the original repo code.

## Screen shots

10.13 Light           
<img src="/screenshots/cm-1013-light.png" alt="1013light" width="50%"/>

10.13 Dark
<img src="/screenshots/cm-1013-dark.png" alt="1013dark" width="50%"/>

12.5 Dark
<img src="/screenshots/cm-125-dark.png" alt="125dark" width="50%"/>

Light/Dark Mode detection works with Safari 15+ (Catalina onwards) but is not fully functional on earlier releases eg: High Sierra has Dark mode only for the main menus and dock and will identify via the @media query as supporting Light Mode although Dark may be set.

I have allowed Issues for this fork however maintenance and updates may be sporadic - it is more just a demo of the potential of the original repo.


## Current Themes

* 10.13 (High Sierra) Light (uses base style.css)
* 10.13 (High Sierra) Dark
* 10.14 (Mojave) Light (pending - possibly same as 10.13)
* 10.14 (Mojave) Dark
* 12.5 (Monterey) Light
* 12.5 (Monterey) Dark


## Features

* MacOS native theming
* 1st level submenu
* No use timeout (no hover detected after right-click CM activation - currently 5 seconds)
* Menu closing when no longer hovered (cursor has left CM region)
* Light/Dark Mode handling Catalina onwards (Safari 15+)
* Disabled menu items
* Icon switching (item selection) (see Click Piggy on last submenu)
* Use of ellipsis when max width used (will give tooltip inherently for incomplete menu items)

## Usage

Just download the zip via the green Code button, unzip then double-click index.html which should open in Safari (right-click for Context Menu).
The page will default to MacOS 12 theming.

## Operational Detail

The index.html contains the hooks for the Context Menu. In this case the data-id is the hook for the clicked task. Once the menu is open then the data-action attribute provides the hook for each item. If the item happens to be a submenu link the data-action will be smx where x is the item row starting from 0 in the Context Menu. eg: if a Context Menu has 7 item rows with the submenus being on the second and last rows then the respective data-action attributes should be sm1 and sm6 (see index.html for detail).

## Tests

This fork was tested in the following browsers:

* Safari 13 & 15 (High Sierra/Monterey)
* Firefox 106 Nightly
* Chromium 84
* Opera 88/91 (slight misalignments)


## License

Licensed under the MIT license, [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)

Copyright 2014, Call Me Nick  (original repo author)

[http://callmenick.com](http://callmenick.com)