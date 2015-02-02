(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

(function() {

  /**
   * read data-ua-code attribute configured on surrounding script tag
   * would probably fail if script is loaded async
   *
   * @returns {string|*}
   */
  function readUaCode() {
    var scripts = document.getElementsByTagName('script');
    var currentScript = scripts[scripts.length -1];

    return currentScript.getAttribute('data-ua-code');
  }

  ga('create', readUaCode(), 'auto');
  ga('set', 'anonymizeIp', true);
  ga('send', 'pageview');
})();