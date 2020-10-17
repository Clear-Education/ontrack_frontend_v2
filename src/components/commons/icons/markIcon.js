import * as React from "react"

function MarkIcon(props) {
  return (
    <svg viewBox="0 0 410 512" {...props}
    style={{ width: '30px', display: 'block' }} 
    >
      <defs>
        <style>{`.prefix__cls-2{fill:${props.color}}`}</style>
      </defs>
      <title>{"notas"}</title>
      <g id="prefix__Capa_2" data-name="Capa 2">
        <g id="prefix__Layer_1" data-name="Layer 1">
          <path className="prefix__cls-2" d="M314.14 9.22v96.56h87.51z" />
          <path
            className="prefix__cls-2"
            d="M299.14 135.78a15 15 0 01-15-15V0h-241A43.16 43.16 0 000 43.12v425.76A43.16 43.16 0 0043.12 512h323.76A43.16 43.16 0 00410 468.88v-333.1zm-12.83 71.42a15 15 0 0121.22 0l8.77 8.8 31.47-31.46A15 15 0 01369 205.73l-42.09 42.07a15 15 0 01-21.21 0l-19.38-19.38a15 15 0 010-21.22zm0 102a15 15 0 0121.22 0l8.77 8.8 31.47-31.46a15 15 0 0121.23 21.2l-42.07 42.07a15 15 0 01-21.21 0l-19.38-19.38a15 15 0 010-21.21zM73.56 51h47a15 15 0 010 30h-47a15 15 0 010-30zm0 52.1h102.05a15 15 0 010 30H73.56a15 15 0 010-30zm154.92 332.15H73.56a15 15 0 010-30h154.92a15 15 0 110 30zm0-98.48H73.56a15 15 0 010-30h154.92a15 15 0 110 30zm0-102H73.56a15 15 0 010-30h154.92a15 15 0 110 30zM369 406.22l-42.07 42.07a15 15 0 01-21.21 0l-19.4-19.39a15 15 0 1121.21-21.21l8.78 8.78L347.77 385A15 15 0 01369 406.22z"
          />
        </g>
      </g>
    </svg>
  )
}

export default MarkIcon
