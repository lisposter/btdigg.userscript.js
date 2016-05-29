// ==UserScript==
// @name         btdigg utility
// @homepageURL  https://github.com/lisposter/btdigg.userscript.js
// @version      0.2.0
// @description  fast select and copy magnet
// @author       Leigh Zhu
// @match        http://btdigg.org/search?*
// @grant        GM_addStyle
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//code.jquery.com/jquery-2.1.4.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main() {
  var $ = window.jQ;

  $(document).ready(function() {

    //////// == Data service
    function Data() {
      this.el = document.getElementById('magnet-links');
    }

    Data.prototype.addLinks = function(links) {
      this.el.value = links;
      localStorage.setItem('links', links);
    };

    Data.prototype.loadLinks = function() {
      this.el.value = localStorage.getItem('links');
      return localStorage.getItem('links');
    };

    Data.prototype.resetLinks = function() {
      this.el.value = '';
      localStorage.setItem('links', '');
    };

    //////// == main
    $('body').append('<div id="links-panel">' +
        '<button id="btn-reset"> Reset </button>' +
        '<textarea id="magnet-links" cols="100" rows="10"></textarea>' +
      '</div>');

    // init service
    var DataService = new Data();

    // reload links data
    DataService.loadLinks();
    var magentLinks = $.makeArray($('a[href^=magnet]'))
      .map(function(itm) {
        return itm.href;
      });
    var selectedLinks = DataService.split('/n') ? DataService.loadLinks().split('/n') : [];

    function addCheckboxs() {
      $('.torrent_name a')
        .each(function() {
          var hash = /info_hash=(.+)(&q=.+)/.exec($(this).attr('href'))[1];
          var magnet = magentLinks.filter(function(link) {
            return link.indexOf(hash) >= 0;
          })[0];

          var ipt = $('<input type="checkbox" />');
          ipt.change(function() {
            if ($(this).prop('checked')) {
              selectedLinks.push(magnet);
            } else {
              selectedLinks.splice(selectedLinks.indexOf(magnet), 1);
            }
            DataService.addLinks(selectedLinks.join('\n') + '\n');
          })
          $(this).prepend(ipt);
        });
    }

    addCheckboxs();

    // reset data button
    $('#btn-reset').click(function() {
      DataService.resetLinks();
    });

  })

}

// init
addJQuery(main);

//////// == style
GM_addStyle('#links-panel { position: fixed;top: 10%;right: 2%;box-shadow: 0 5px 10px #ddd;border: 1px solid #02a3c6; }');
GM_addStyle('#btn-reset { position: absolute;top: -20px;height: 20px;border-radius: 0;background: #fff;border: 1px solid #02a3c6;border-bottom: none;left: -1px; }');
GM_addStyle('#magnet-links { border: 1px solid #f8f8f8;background: rgba(230, 230, 230, .9) }');
GM_addStyle('.checkbox { font-size: 100%; margin-right: .5em; }');
