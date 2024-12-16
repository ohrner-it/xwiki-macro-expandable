# XWIKI Expandable Macro

## Description
Similar to an HTML “&lt;details&gt;” element, this enables more extensive information to be displayed first in short form and the exact details to be displayed only when the mouse is clicked. 
If several of these Expandable elements are arranged directly on top of each other, they form an accordion component.

![expandable.png](preview/expandable.png)

## Prerequisites & Installation Instructions
We recommend using the Extension Manager to install this extension (Make sure that the text "Installable with the Extension Manager" is displayed at the top right location on this page to know if this extension can be installed with the Extension Manager). 
Note that installing Extensions when being offline is currently not supported and you'd need to use some complex manual method.

You can also use the following manual method, which is useful if this extension cannot be installed with the Extension Manager or 
if you're using an old version of XWiki that doesn't have the Extension Manager:

1. Log in the wiki with a user having Administration rights
2. Go to the Administration page and select the Import category 
3. Follow the on-screen instructions to upload the downloaded XAR 
4. Click on the uploaded XAR and follow the instructions 
5. Click on the second option "Replace the page history with the history from the package"
6. Click on the import button

You'll also need to install all dependent Extensions that are not already installed in your wiki

## Dependencies
org.xwiki.platform:xwiki-platform-rendering-wikimacro-api 15.10</br>
org.xwiki.platform:xwiki-platform-skin-skinx 15.10</br>
org.xwiki.platform:xwiki-platform-rendering-macro-velocity 15.10</br>
org.xwiki.rendering:xwiki-rendering-macro-html 15.10</br>
