<template>
   <transition name="fade">
      <div :class="classes" :style="outerStyles" v-show="show">
         <div :class="innerClasses" :style="styles"></div>
      </div>
   </transition>
</template>
<script>
const prefixCls = "loading-bar";

export default {
   name: "LoadingBar",
   props: {
      color: {
         type: String,
         default: "primary"
      },
      failedColor: {
         type: String,
         default: "error"
      },
      height: {
         type: Number,
         default: 4
      }
   },
   data() {
      return {
         percent: 0,
         status: "success",
         show: false
      };
   },
   computed: {
      classes() {
         return `${prefixCls}`;
      },
      innerClasses() {
         return [
            `${prefixCls}-inner`,
            {
               [`${prefixCls}-inner-color-primary`]:
                  this.color === "primary" && this.status === "success",
               [`${prefixCls}-inner-failed-color-error`]:
                  this.failedColor === "error" && this.status === "error"
            }
         ];
      },
      outerStyles() {
         return {
            height: `${this.height}px`
         };
      },
      styles() {
         const style = {
            width: `${this.percent}%`,
            height: `${this.height}px`
         };

         if (this.color !== "primary" && this.status === "success") {
            style.backgroundColor = this.color;
         }

         if (this.failedColor !== "error" && this.status === "error") {
            style.backgroundColor = this.failedColor;
         }

         return style;
      }
   }
};
</script>

<style lang="less">
@prefixCls: loading-bar;
.formateClass(@content,@set) {
   .@{prefixCls}-@{content} {
      each(@set,{
        @{key}:@value;
      });
   }
}
.@{prefixCls} {
   width: 100%;
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   z-index: 2100;
   .formateClass(inner,{transition:width 1s linear;});
   .formateClass(inner-color-primary,{background-color:#45b035;});
   .formateClass(inner-failed-color-error,{background-color:#ed4014;});
}
</style>
