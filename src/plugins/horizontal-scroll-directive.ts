import animateScrollTo from "animated-scroll-to";

export const horizontalScrollDirective = {
  mounted: (el, binding, vnode, oldVnode) => {
    const wheel = (e) => {
      //if (el.scrollLeft === targetLeft) sumDelta = 0
      if (el.horizontalScrollDirective.sumDelta === 0)
        el.horizontalScrollDirective.startLeft = el.scrollLeft;
      el.horizontalScrollDirective.sumDelta -= e.deltaY;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const left = Math.min(
        maxScrollLeft,
        Math.max(
          0,
          el.horizontalScrollDirective.startLeft -
            el.horizontalScrollDirective.sumDelta
        )
      );
      // targetLeft = left
      // el.scrollTo({left, behavior: "smooth"})
      animateScrollTo([left, null], {
        elementToScroll: el
      }).then((e) => {
        //if (e !== (el.scrollLeft === left)) console.log(e, el.scrollLeft === left)
        if (e) el.horizontalScrollDirective.sumDelta = 0;
      });
      if (el.scrollWidth != el.clientWidth) e.preventDefault();
    };

    el.addEventListener("wheel", wheel);

    el.horizontalScrollDirective = {
      sumDelta: 0,
      startLeft: 0,
      onUnbind: () => {
        el.removeEventListener("wheel", wheel);
      }
    };
  },
  beforeUnmount: (el, binding, vnode, oldVnode) => {
    el.horizontalScrollDirective.onUnbind();
  }
};
