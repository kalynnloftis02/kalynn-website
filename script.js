/**
 * Shared count-up and fade-in animations for stat cards.
 *
 * How it works:
 *   The script looks for every element with class "countup-group".
 *   Inside that group it finds child elements marked with data attributes:
 *
 *   data-countup="<number>"   – Animate from 0 to <number>.
 *   data-countup-decimals     – Decimal places (default 0).
 *   data-countup-suffix       – Appended after the number (e.g. "×" or "M").
 *   data-countup-commas       – If present, format with locale commas.
 *   data-countup-fade         – Fade in (no counting), for text-only values.
 *
 *   Each group is observed independently via IntersectionObserver and
 *   animates only once when it scrolls into view.
 *
 *   Respects prefers-reduced-motion: if the visitor has reduced motion
 *   turned on, the animation is skipped entirely and final values stay
 *   visible from the HTML.
 */
(function () {
  'use strict';

  // Bail out immediately if the visitor prefers reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var DURATION = 2000; // 2 seconds, matching the homepage timing

  /**
   * Format a number according to the item's configuration.
   */
  function formatValue(value, item) {
    var str;
    if (item.decimals > 0) {
      str = value.toFixed(item.decimals);
    } else {
      str = Math.round(value).toString();
    }
    if (item.commas) {
      // Only format the integer portion with commas
      var parts = str.split('.');
      parts[0] = Number(parts[0]).toLocaleString('en-US');
      str = parts.join('.');
    }
    return str + item.suffix;
  }

  /**
   * Run the count-up + fade-in animation for one group.
   */
  function animateGroup(group) {
    var countEls = group.querySelectorAll('[data-countup]');
    var fadeEls = group.querySelectorAll('[data-countup-fade]');

    var countItems = [];
    for (var i = 0; i < countEls.length; i++) {
      var el = countEls[i];
      countItems.push({
        el: el,
        target: parseFloat(el.getAttribute('data-countup')),
        decimals: parseInt(el.getAttribute('data-countup-decimals') || '0', 10),
        suffix: el.getAttribute('data-countup-suffix') || '',
        commas: el.hasAttribute('data-countup-commas')
      });
    }

    var startTime = null;

    // Set initial values
    countItems.forEach(function (item) {
      item.el.textContent = formatValue(0, item);
    });
    for (var j = 0; j < fadeEls.length; j++) {
      fadeEls[j].style.opacity = '0';
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / DURATION, 1);
      // Ease-out cubic for smooth deceleration at the end
      var eased = 1 - Math.pow(1 - progress, 3);

      countItems.forEach(function (item) {
        item.el.textContent = formatValue(item.target * eased, item);
      });

      for (var k = 0; k < fadeEls.length; k++) {
        fadeEls[k].style.opacity = eased;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Guarantee exact final values
        countItems.forEach(function (item) {
          item.el.textContent = formatValue(item.target, item);
        });
        for (var m = 0; m < fadeEls.length; m++) {
          fadeEls[m].style.opacity = '';
        }
      }
    }

    requestAnimationFrame(step);
  }

  // Find every countup-group on the page and observe it
  var groups = document.querySelectorAll('.countup-group');
  if (!groups.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          obs.unobserve(entry.target);
          animateGroup(entry.target);
        }
      });
    }, { threshold: 0.15 });

    for (var g = 0; g < groups.length; g++) {
      observer.observe(groups[g]);
    }
  } else {
    // Fallback for older browsers: animate immediately
    for (var h = 0; h < groups.length; h++) {
      animateGroup(groups[h]);
    }
  }
})();
