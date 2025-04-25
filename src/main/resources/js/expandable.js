{
  // Animation parameters for expanding and collapsing the expandable element
  const animationDurationMillis = 300;
  const animationEasing = 'ease-in-out';

  // CSS class names
  const expandableBaseClass = 'xw-expandable';
  const expandableExpandedClass = 'xw-expandable_expanded';
  const expandableHeaderClass = 'xw-expandable_header';
  const expandableCaretClass = 'xw-expandable_caret';
  const expandableContentClass = 'xw-expandable_content';

  let ignoreEvents = false; // Indicates to ignore click and keypress events while animating

  // Event handler when the expanding or collapsing of the expandable element has been triggered.
  // Argument `toggleEvent` is a `CustomEvent` that contains the causing click or keypress event
  // as "detail" property.
  // It will be dispatched on `document` as event type "internal:expandable-toggle" whenever a
  // click or keypress event has been dispatched on the header of the expandable component.
  // In this way we prevent the need for a global event handler function that would pollute the
  // global namespace.
  function handleToggleEvent(toggleEvent) {
    toggleEvent.stopPropagation();

    const ev = toggleEvent.detail;

    if (ev.type === 'click' || (ev.type === 'keypress' && ev.key === ' ')) {
      ev.stopPropagation();
      ev.preventDefault();
    } else {
      return;
    }

    if (ignoreEvents) {
      return;
    }

    ignoreEvents = true;
    const expandableElem = ev.currentTarget.parentNode;

    (expandableElem.classList.contains(expandableExpandedClass)
      ? collapseExpandable(expandableElem)
      : expandExpandable(expandableElem)
    ).then(() => (ignoreEvents = false));
  }

  function getExpandableCaret(expandableElem) {
    return expandableElem.querySelector(`& > .${expandableHeaderClass} > .${expandableCaretClass}`);
  }

  function getExpandableContent(expandableElem) {
    return expandableElem.querySelector(`& > .${expandableContentClass}`);
  }

  async function expandExpandable(expandableElem) {
    expandableElem.classList.add(expandableExpandedClass);
    const contentElem = getExpandableContent(expandableElem);
    const caretElem = getExpandableCaret(expandableElem);

    const animateContent = animate(contentElem, [
      { maxHeight: '0', overflowY: 'hidden' },
      { maxHeight: contentElem.scrollHeight + 'px', overflowY: 'hidden' },
    ]);

    const animateCaret = animate(caretElem, [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(90deg)' },
    ]);

    collapseOtherExpandablesOfAccordionIfRequired(expandableElem);
    await Promise.any([animateContent, animateCaret]);
  }

  async function collapseExpandable(expandableElem) {
    if (!expandableElem.classList.contains(expandableExpandedClass)) {
      return;
    }

    const contentElem = getExpandableContent(expandableElem);
    const caretElem = getExpandableCaret(expandableElem);

    const animateContent = animate(contentElem, [
      { maxHeight: contentElem.scrollHeight + 'px', overflowY: 'hidden' },
      { maxHeight: 0, overflowY: 'hidden' },
    ]);

    const animateCaret = animate(caretElem, [
      { transform: 'rotate(90deg)' },
      { transform: 'rotate(0deg)' },
    ]);

    await Promise.any([animateContent, animateCaret]);
    expandableElem.classList.remove(expandableExpandedClass);
  }

  async function animate(elem, keyframes) {
    return new Promise((resolve) => {
      const animation = elem.animate(keyframes, {
        duration: userPrefersReducedMotion() ? 0 : animationDurationMillis,
        easing: animationEasing,
      });

      animation.addEventListener('cancel', () => resolve(), { once: true });
      animation.addEventListener('finish', () => resolve(), { once: true });
    });
  }

  // Users may configure in the browser that they do not like motion like animations or
  // transitions. If motion shall be reduced, the expandable should not use any animations.
  // Actually, we'll force an animation duration of 0 ms in that case.
  function userPrefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isExpandable(elem) {
    return elem.classList.contains(expandableBaseClass);
  }

  // Get all expandable elements that form an accordion.
  // Be aware that those expandable elements are siblings.
  function getAccordionExpandables(expandableElem) {
    const accordionExpandables = [expandableElem];
    let previousSibling = expandableElem.previousElementSibling;
    let nextSibling = expandableElem.nextElementSibling;

    while (previousSibling && isExpandable(previousSibling)) {
      accordionExpandables.push(previousSibling);
      previousSibling = previousSibling.previousElementSibling;
    }

    while (nextSibling && isExpandable(nextSibling)) {
      accordionExpandables.push(nextSibling);
      nextSibling = nextSibling.nextElementSibling;
    }

    return accordionExpandables;
  }

  function collapseOtherExpandablesOfAccordionIfRequired(expandableElem) {
    const expandablesOfAccordion = getAccordionExpandables(expandableElem);

    const collapsingOfOtherExpandablesRequired = expandablesOfAccordion.some((elem) =>
      elem.hasAttribute('data-force-exclusive-accordion'),
    );

    if (!collapsingOfOtherExpandablesRequired) {
      return;
    }

    expandablesOfAccordion.filter((it) => it !== expandableElem).forEach(collapseExpandable);
  }

  // Whenever a `click` or `keypress`event is dispatched on the header of an expandable element
  // it will be wrapped in a custom element with the causing `click` or `keypress` event as
  // `detail` property.
  // In this way we prevent the need for a global event handler function that would pollute the
  // global namespace.
  document.addEventListener('internal:expandable-toggle', handleToggleEvent);
}
