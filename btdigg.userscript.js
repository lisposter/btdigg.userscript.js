// ==UserScript==
// @name         btdigg utility
// @homepageURL  https://github.com/lisposter/btdigg.userscript.js
// @version      0.1.0
// @description  fast select and copy magnet
// @author       Leigh Zhu
// @match        http://btdigg.org/search?*
// @grant        GM_addStyle
// ==/UserScript==

;(function(window, document) {

  Node.prototype.prependChild = function(el) {
    if (this.childNodes[0]) {
      this.insertBefore(el, this.childNodes[0]);
    } else {
      this.appendChild(el);
    }
  };

  document.querySelector('body').innerHTML = document.querySelector('body').innerHTML +
    '<div id="links-panel">' +
      '<button id="btn-reset"> Reset </button>' +
      '<textarea id="magnet-links" cols="100" rows="10"></textarea>' +
    '</div>';

  var linksBox = document.getElementById('magnet-links');
  linksBox.value = localStorage.getItem('links') || '';

  var magentLinks = Array.prototype.slice.call(document.querySelectorAll('a[href^=magnet]'))
    .map(function(itm) {
      return itm.href;
    });
  var selectedLinks = [];

  function addCheckboxs() {
    Array.prototype.slice.call(document.querySelectorAll('.torrent_name'))
      .forEach(function(el) {
        var hash = /info_hash=(.+)(&q=.+)/.exec(el.querySelector('a').href)[1];
        var magnet = magentLinks.filter(function(link) {
          return link.indexOf(hash) >= 0;
        })[0];

        var ipt = document.createElement('input');
        ipt.setAttribute('type', 'checkbox');
        ipt.setAttribute('class', 'checkbox');
        ipt.addEventListener('change', function(e) {
          if (e.target.checked === true) {
            selectedLinks.push(magnet);
          } else {
            selectedLinks.splice(selectedLinks.indexOf(magnet), 1);
          }
          linksBox.value = (linksBox.value || '') + selectedLinks.join('\n');
          localStorage.setItem('links', linksBox.value);
        });

        el.prependChild(ipt);
      });
  }

  addCheckboxs();


  document.getElementById('btn-reset').addEventListener('click', function() {
    linksBox.value = '';
    localStorage.setItem('links', '');
  });

})(window, document);

GM_addStyle('#links-panel { position: fixed;top: 10%;right: 2%;box-shadow: 0 5px 10px #ddd;border: 1px solid #02a3c6; }');
GM_addStyle('#btn-reset { position: absolute;top: -20px;height: 20px;border-radius: 0;background: #fff;border: 1px solid #02a3c6;border-bottom: none;left: -1px; }');
GM_addStyle('#magnet-links { border: 1px solid #f8f8f8;background: rgba(230, 230, 230, .9) }');
GM_addStyle('.checkbox { font-size: 100%; margin-right: .5em; }');
