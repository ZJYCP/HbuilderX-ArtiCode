const path = require('path');

const vueFile = path.join(path.resolve(__dirname), 'static', 'vue.min.js');
const customCssFile = path.join(path.resolve(__dirname), 'static', 'custom.css');
const iconfontCssFile = path.join(path.resolve(__dirname), 'static', 'iconfont','iconfont.css');
const markedFile = path.join(path.resolve(__dirname), 'static','vendor', 'marked.min.js');
const hightLightFile = path.join(path.resolve(__dirname), 'static','vendor', 'highlight.min.js');
const hightLightCssFile = path.join(path.resolve(__dirname), 'static', 'vendor', 'highlight.min.css');
const mainFile = path.join(path.resolve(__dirname), 'static', 'main.js');



function Html(projectData) {
	return `
    <!DOCTYPE html>
    <html lang="en" @keydown='handleInterrupt'>
        <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="${customCssFile}">
			<link rel="stylesheet" href="${iconfontCssFile}">
            <link rel="stylesheet" href="${hightLightCssFile}">
			<script src="${markedFile}"></script>
			<script src="${hightLightFile}"></script>
            <script src="${vueFile}"></script>
        </head>
        <body>
			<div id="app" v-cloak class="app">
				<div class="content">
					<div v-for='(v,k,i) in list' :key='k' class="conversition" v-focus>
						<div class="question-block"><strong>You：</strong> <i>{{v[0]}}</i></div>
						<div class="response-block hljs" ref="hlDiv" v-html="v[1]"></div>
				</div>
				<div class="bottom">
					<div class="input">
					  <input type="text" v-model='inputQuestion' @keyup.enter='()=>{submitHandle(inputQuestion)}' placeholder='请输入问题' />
						<button @click='()=>{submitHandle(inputQuestion)}' class="submit" ><i class="iconfont icon-submit"></i></button>
					</div>
					<button @click='handleClearClick' class="clearall">清除所有</button>
				</div>		
			</div>
            <script src="${mainFile}"></script>
        </body>
    </html>
`
};

module.exports = Html;