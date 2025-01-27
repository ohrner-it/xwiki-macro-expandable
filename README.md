# XWiki Expandable Macro

## Description
Similar to an HTML &lt;details&gt; element, this macro enables information to be displayed in short form first, while 
showing the full details on mouse click.
If several of these Expandable macros are arranged directly on top of each other, they form an accordion component.

![expandable.png](preview/expandable.png)

## Installation Instructions

1. Download file `xwiki-macro-expandable-<version>.xar`
2. Log in to XWiki with an administration user
3. Go to the "Global Administration" page and select the "Content" -> "Import".
4. Follow the on-screen instructions to upload the downloaded XAR file
5. Click on the uploaded XAR file and follow the instructions 
6. Click on the second option "Replace the page history with the history from the package"
7. Click on the "Import" button

## Dependencies
org.xwiki.platform:xwiki-platform-rendering-wikimacro-api</br>
org.xwiki.platform:xwiki-platform-skin-skinx</br>
org.xwiki.platform:xwiki-platform-rendering-macro-velocity</br>
org.xwiki.rendering:xwiki-rendering-macro-html</br>
