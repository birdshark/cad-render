import $ from 'jquery'
import "./dom"
import namespace from './namespace'
import browser from './browser'
import {dataUrlToBlob,extend} from './utils'
import Element from './virtual-dom/element'

var Paper = function(el,option){
    return this.init(el,option);
}
Paper.prototype = {
    touches:function(e){
        var svg = this.svg.get(0);
        var clientRect  = svg.getBoundingClientRect();
        var ret = [];
        if(/touch/gi.test(e.type)&&e.originalEvent) {
            for(var i = 0; i < e.originalEvent.touches.length;i++) {
                ret.push({
                    x:e.originalEvent.touches[i].clientX - clientRect.left,
                    y:e.originalEvent.touches[i].clientY - clientRect.top
                })
            }
        } else {
            for(var i = 0; i < e.touches.length;i++) {
                ret.push({
                    x:e.touches[i].clientX - clientRect.left,
                    y:e.touches[i].clientY - clientRect.top
                })
            }
        }
        return ret;
    },
    mouse:function(e,mutiple){
        var svg = this.svg.get(0);
        var clientRect  = svg.getBoundingClientRect();
        if(!mutiple) {
            if(!/touch/gi.test(e.type)) {
                return {x:e.clientX - clientRect.left,y:e.clientY- clientRect.top};   
            } else {
                if(e.originalEvent.touches.length>0) {
                    return {
                        x:e.originalEvent.touches[0].clientX  - clientRect.left,
                        y:e.originalEvent.touches[0].clientY - clientRect.top
                    };
                } else {
                    return null;
                }
                
            }
        } else {
            var ret = [];
            
        }
    },
    createVirtualDOM(tagName,props,children){
        return new Element(tagName,props,children);
    },
    createSVGElement:function(tagName,attributes) {
        tagName = $.trim(tagName);
        var SVG_NAMESPACE = namespace.svg;
        var XLink_NS = namespace.xlink;
        var el = document.createElementNS(SVG_NAMESPACE,tagName);
        if(typeof attributes === 'object') {
            for(var key in attributes) {
                if(typeof attributes[key]!='undefined') {
                    if(key!='xlink:href') {
                        el.setAttribute(key,attributes[key]);
                    } else {
                        el.setAttributeNS(XLink_NS,'xlink:href',attributes[key]);
                    }
                }
            }
        }
        return $(el);
    },
    init:function(el,option){
        var el,width,height;
        if(typeof option == 'undefined') {
            option = {};
        }
        el = $(el).first();
        var width = option.width||$(el).width()||600;
        var height = option.height||$(el).height()||400;
        var svg = this.createSVGElement('svg',{width:width,height:height,xmlns:"http://www.w3.org/2000/svg"});
        svg.attr("xmlns:xlink",namespace.xlink);
        var defs = this.createSVGElement("defs");
        $(el).append(svg);
        $(svg).append(defs);
        this.svg = svg;
        this.initDefaultLayer();
        return this;
    },
    width:function(){
        var args = Array.prototype.slice.call(arguments,0);
        var width = this.svg.width.apply(this.svg,args);
        return width;
    },
    height:function(){
        var args = Array.prototype.slice.call(arguments,0);
        var height = this.svg.height.apply(this.svg,args);
        return height;
    },
    getCenterPoint:function(){
        var width = this.width();
        var height = this.height();
        return {x:width/2,y:height/2};
    },
    append:function(tagName,attributes){
        var currentLayer = this.currentLayer;
        var el;
        if(! (currentLayer instanceof Element)) {
            el = this.createSVGElement(tagName,attributes);
            $(currentLayer).append(el);
        } else {
            el = this.createVirtualDOM(tagName,attributes);
            currentLayer.append(el);
        }
        return el;
    },
    prepend:function(){
        var currentLayer = this.currentLayer;
        var el = this.createSVGElement(tagName,attributes);
        $(currentLayer).prepend(el);
        return el;
    },
    select:function(selector){
        return $(selector,this.svg.ownerDocument);
    },
    on:function(){
        var args = Array.prototype.slice.call(arguments,0);
        this.svg.on.apply(this.svg,args);
        return this;
    },
    off:function(){
        var args = Array.prototype.slice.call(arguments,0);
        this.svg.off.apply(this.svg,args);
        return this;
    },
    getXML:function(){
        var svg = this.svg;
        return svg.parent().html();
    },
    getBase64:function(callback){
        if(browser.ie) {
            callback.call(null,"")
        }
        var paper = this;
        var xml = this.getXML();
        var width = paper.width();
        var height = paper.height();
        var image = new Image();
        image.width = width;
        image.height = height;
        var src;
        var dataUrl = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(xml)));
        var blob = dataUrlToBlob(dataUrl);
        src = URL.createObjectURL(blob);
        image.onload = function(){
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
            var data = canvas.toDataURL('image/png');
            URL.revokeObjectURL(src);
            callback.call(this,data);
        };
        image.src = src;
        return this;
    },
    downloadImage:function(name) {
        this.getBase64(function(base64){
            var a = document.createElement('a');
            a.href = base64;  //将画布内的信息导出为png图片数据
            a.download = name || (document.title); //设定下载名称
            a.target="_blank";
            // Chrome and Firefox 
            // 来自echarts
            if (typeof MouseEvent === 'function' && !(browser.msedge||browser.msie)) {
                var evt = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: false
                });
                a.dispatchEvent(evt);
            } 
            // IE
            else {
                var html = ''
                    + '<body style="margin:0;">'
                    + '<img src="' + base64 + '" style="max-width:100%;" title="' + ('test') + '" />'
                    + '</body>';
                var tab = window.open();
                tab.document.write(html);
            }
        });
        return this;
    },
    downloadSVG:function(){
        var xml = this.getXML();
        var base64 = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(xml)));
        var a = document.createElement('a');
            a.href = base64;  //将画布内的信息导出为png图片数据
            a.download = name || (document.title); //设定下载名称
            if(browser.chrome) {
                a.click();
            } else {
                window.open(a.href);
            }
        return this;
    },
    destroy:function(){
        this.currentLayer = null;
        this.svg.remove();
        this.svg = null;
    }
}
Paper.fn = Paper.prototype;
Paper.extend = Paper.fn.extend = extend;
module.exports = Paper;