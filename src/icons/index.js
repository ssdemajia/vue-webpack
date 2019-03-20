import Vue from 'vue'
import SvgIcon from '../shared/SvgIcon'

Vue.component('svg-icon', SvgIcon)
const svgReq = require.context('./svg', false, /\.svg$/)
// eslint-disable-next-line no-console
svgReq.keys().map(svgReq)
