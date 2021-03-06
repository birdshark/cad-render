import React from 'react'

module.exports = React.createClass({
	render(){
		return (
			<div className="content">
				<h1>介绍</h1>
				<h2>关于cad render</h2>
				<p>
					cad render是一个轻量但强大的svg绘图库，它参考了cad中的图层概念和一些绘图技巧。
					<br/>除了支持普通的图形
					如 线、矩形、圆、椭圆、折线、多边形、路径外，还内置了扇形、心形、正多边形等常用图形。
					<br/>并且可以方便地自定义可重复使用的图形。
					<br/>内置了模糊、阴影滤镜，
					<br/>提供颜色处理、数学，插值，采样函数。
					<br/>jquery式的链式操作和动画。
					<br/>强大的path模块和point模块
				</p>
				<h2>起步</h2>
               <p className="tip">假设你已经了解了绘图的基本知识，推荐一个svg知识的网站</p>
               <p>引入<code>jquery</code>或<code>zepto</code> 、 <code>cad.js</code></p>
<pre>
{`
//引入jquery作为dom操作库,也可以用zepto
<script src="./jquery.js"></script>
//引入cad.js
<script src="cad.js"></script>
`}
</pre>
               <h3>创建画布</h3>
               <pre>{'<script>\n  var paper = new cad.Paper(document.getElementById("demo"))\n</script>'}</pre>
               <h3>愉快地玩耍</h3>
               <pre>{'//画一条从点(0,0)到点(100,100)的直线\n paper.line(0,0,100,100);'}</pre>
			   <div ref="demo" style={{height:300}}></div>
			</div>
		)
	},
	componentDidMount(){
		var ref = this.refs.demo;
		var paper = new cad.Paper(ref);
		paper.rect(0,0,paper.width(),paper.height()).fill("#000");
		paper.configLayer({"fill":"#fff"})
		paper.line(0,0,100,100).stroke("#fff");
		paper.text(110,110,"p(100,100)").fill("lightgreen")
	}
})