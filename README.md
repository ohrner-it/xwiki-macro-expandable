# XWiki Expandable Macro

## Description
Similar to an HTML &lt;details&gt; element, this macro enables information to be displayed in short form first, while 
showing the full details on mouse click.
If several of these Expandable macros are arranged directly on top of each other, they form an accordion component.

![expandable.png](preview/expandable.png)

## Features

- Allows to expand/collapse information details
- Expandable elements can be expanded or collapsed by default
- Stacked Expandable elements form an accordion
- Accordions can be non-exclusive (means, each accordion item can be expanded/collapsed individually) or exclusive
  (means, only one accordion item of an exclusive accordion can be expanded at the same time)

## Installation Instructions

Please use the XWiki Extension Manager to install the Expandable macro.

## Dependencies
org.xwiki.platform:xwiki-platform-rendering-wikimacro-api</br>
org.xwiki.platform:xwiki-platform-skin-skinx</br>
org.xwiki.platform:xwiki-platform-rendering-macro-velocity</br>
org.xwiki.rendering:xwiki-rendering-macro-html</br>
