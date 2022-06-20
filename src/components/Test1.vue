<template>
  <svg className="dv-svg-container" width="1086" height="838">
    <defs>
      <path id="path" d="M 17 541.89C 17 541.89 -1 620.89 7 644.89C 33 646.89 155 672.89 189 711.89C 200 746.89 155 804.89 415 823.89C 544 827.89 1053 626.89 1053 626.89" fill="transparent" />

      <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style="stop-color: red; stop-opacity: 1" />

        <stop offset="20%" style="stop-color: red; stop-opacity: 0.9" />

        <stop offset="100%" style="stop-color: red; stop-opacity: 0" />
      </radialGradient>

      <!-- 流线是圆的一条半径， 圆的颜色为径向渐变，  此渐变圆是svg的path的遮罩 -->
      <mask id="mask">
        <circle id="circle" cx="0" cy="0" r="120" fill="url(#grad1)">
          <animateMotion
            dur="4"
            path="M 17 541.89C 17 541.89 -1 620.89 7 644.89C 33 646.89 155 672.89 189 711.89C 200 746.89 155 804.89 415 823.89C 544 827.89 1053 626.89 1053 626.89"
            rotate="auto"
            repeatCount="indefinite"
          />
        </circle>
      </mask>
    </defs>

    <use href="#path" stroke="rgba(0, 0, 0, .1)" strokeWidth="1"></use>

    <use href="#path" stroke="red" mask="url(#mask)" stroke-width="4">
      <!-- <animate attributeName="stroke-dasharray" from="0, 1250" to="1250, 0" dur="4s" repeatCount="indefinite" /> -->
    </use>
  </svg>
</template>
