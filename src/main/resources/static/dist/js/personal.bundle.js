!function(e){var t={};function a(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=2)}({2:function(e,t){$(document).ready(function(){const e=$("#avator");function t(e){let t=$("<h4>").addClass("card-title").text(e.name),a=[$("<p>").addClass("card-text").text("考试时间："+e.date),$("<p>").addClass("card-text").text("报名截止："+e.deadline),$("<p>").addClass("card-text").text("考试地点："+e.loc)],n=$("<button>").addClass("btn btn-sm btn-primary").attr("type","button").text("开始考试");n.on("click",e=>{$.post("/api/ready_exam",JSON.stringify({id:"id"})).then(e=>{console.log(e);const t=(e=JSON.parse(e)).data;e.ret&&"OK"===t.status&&location.assign("http://localhost:8080/exam.html")})});let r=$("<div>").addClass("card-body");r.append(t).append(a[0]).append(a[1]).append(a[2]).append(n),$("#examingDetail").append($("<div>").addClass("col-4").append($("<div>").addClass("card").width("100%").append(r)))}function a(e){let t=[$("<td>").attr("scope","row").text(e.date),$("<td>").text(e.name),$("<td>").text(e.score)];$(".no-examedDetail").hide();let a=$("<tr>");for(let e=0;e<3;e++)a.append(t[e]);$("#examedDetail").append(a)}$.get("/api/userinfo").then(t=>{console.log(t),t=JSON.parse(t),console.log(t);const a=t.data;t.ret&&a&&(e.text(a.username),$("#avator-title").text(`${a.username}，您好！`),$("#trueName").val(a.username),"admin"===a.isAdmin&&$("#isAdmin").show())}).fail(e=>{console.error(e)}),$.get("/api/exam_detail").then(e=>{const n=(e=JSON.parse(e)).data;if(e.ret&&n){let e=n.examing.length;0===e&&$("#examingDetail").text("您没有报名考试");for(let a=0;a<e;a++)t(n.examing[a]);0===n.examed.length&&$(".no-examedDetail").show();for(let t=0;t<e;t++)a(n.examed[t])}});const n=$(".list-group"),r=$(".listBox");n.on("click",e=>{let t=$(e.target).index();n.children().toArray().forEach((e,a)=>{$(e).hasClass("active")&&$(e).removeClass("active"),t===a&&$(e).addClass("active")}),r.toArray().forEach((e,a)=>{$(e).hide(),t===a&&$(e).show()})}),$("#logout").on("click",()=>{});const o=$(".tabGroup1"),d=$(".tabCon1");o.on("click",e=>{let t=$(e.target).index(".tabGroup1 .nav-link");o.children().toArray().map(e=>$(e).children()).forEach((e,a)=>{$(e).hasClass("active")&&$(e).removeClass("active"),t===a&&$(e).addClass("active")}),d.toArray().forEach((e,a)=>{$(e).hide(),t===a&&$(e).show()})});const i=$(".tabGroup2"),l=$(".tabCon2");i.on("click",e=>{let t=$(e.target).index(".tabGroup2 .nav-link");i.children().toArray().map(e=>$(e).children()).forEach((e,a)=>{$(e).hasClass("active")&&$(e).removeClass("active"),t===a&&$(e).addClass("active")}),l.toArray().forEach((e,a)=>{$(e).hide(),t===a&&$(e).show()})})})}});
//# sourceMappingURL=personal.bundle.js.map