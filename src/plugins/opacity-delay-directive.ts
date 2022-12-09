interface ITyperDirectiveElement extends HTMLElement {
  opacityDelayDirective: {
    free: () => void;
  };
}

export const opacityDelayDirective = {
  mounted: (el: ITyperDirectiveElement, binding) => {
    let i: any = null;
    const free = () => {
      if (i !== null) {
        clearTimeout(i);
        i = null;
      }
    };

    el.style.opacity = "1";

    i = setTimeout(() => {
      el.style.opacity = "";
    }, +binding.value || 1000);

    el.opacityDelayDirective = { free };
  },
  beforeUnmount: (el: ITyperDirectiveElement, binding, vnode, oldVnode) => {
    el.opacityDelayDirective.free();
  }
};
