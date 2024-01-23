# Code to be injected into the dotmarket.eu listing page
var moyBreakEven = {"min" : {"total" : 0 , "count" : 0, 'value':0},
                   "max" : {"total" : 0 , "count" : 0, 'value':0}};
document.getElementsByClassName('listing-below-listing-content-container')[0].innerHTML = '<div class="stats"></div>' + document.getElementsByClassName('listing-below-listing-content-container')[0].innerHTML;

function compute_profit() {
  var arr = [].slice.call(document.getElementsByClassName("listing-product"));
arr.forEach((e) => {
    if(e.getElementsByClassName('listing-product-infos-avantages')[0].innerHTML.indexOf('breakeven') > -1) {
    return true;
  }
  let profit = e.getElementsByClassName('listing-product-infos-description-col')[1].getElementsByClassName('listing-product-infos-description-col-texte')[0].innerHTML;
  profit = parseFloat(profit.replace(',',''));
  let traffic = e.getElementsByClassName('listing-product-infos-description-col')[2].getElementsByClassName('listing-product-infos-description-col-texte')[0].innerHTML;
  traffic = parseFloat(traffic.replace(',',''));
  let priceMin = parseFloat(e.getElementsByClassName('listing-product-prices-price')[1].innerHTML);
  let priceMax = parseFloat(e.getElementsByClassName('listing-product-prices-price')[3].innerHTML);
  let title = e.getElementsByTagName('h3')[0].innerHTML;
  if(title.search('VENDU') > -1) {
    e.parentElement.classList.add('hide');
  } else {
    if(profit > 0) {
      moyBreakEven.min.total += priceMin/profit;
      moyBreakEven.min.count += 1;
      moyBreakEven.min.value = moyBreakEven.min.total/moyBreakEven.min.count
      moyBreakEven.max.total += priceMax/profit;
      moyBreakEven.max.count += 1;
      moyBreakEven.max.value = moyBreakEven.max.total/moyBreakEven.max.count
    }
  }
  e.getElementsByClassName('listing-product-infos-avantages')[0].innerHTML += '<div class="listing-product-infos-avantages-item breakeven"><div class="listing-product-infos-avantages-item-texte">💸 Months to breakeven : <div class="moymax">'+bazround(priceMin/profit,2)+'mo</div> - <div class="moymax">'+bazround(priceMax/profit,2)+'mo</div></div></div>';
	  e.getElementsByClassName('listing-product-infos-avantages')[0].innerHTML += '<div class="listing-product-infos-avantages-item cpmm"><div class="listing-product-infos-avantages-item-texte">💸 CPM/m : <div class="cpmmmin">'+bazround(priceMin/traffic,2)+'€</div> - <div class="cpmmmax">'+bazround(priceMax/traffic,2)+'€</div></div></div>';
});
  document.getElementsByClassName('stats')[0].innerHTML = '<div class="text3 align-left">Months to breakeven Median from '+bazround(moyBreakEven.min.value,2)+' to '+bazround(moyBreakEven.max.value,2)+' months <br/></div>';
}

// select the target node
var target = document.querySelector('.listing-below-listing-content-annonces');

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
          compute_profit();
    });
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true }

// pass in the target node, as well as the observer options
observer.observe(target, config);

// later, you can stop observing
//observer.disconnect();
setTimeout(compute_profit,1000);

function bazround(number,precision) {
  let value = number*Math.pow(10,precision);
  value = Math.round(value);
  value = value / Math.pow(10,precision);
  return value;
}

var element = document.createElement('style'),
    sheet;

// Append style element to head
document.head.appendChild(element);

// Reference to the stylesheet
sheet = element.sheet;
var styles = '.moymin, .moymax, .cpmmmin, .cpmmmax { display: inline; } ';
var stylesStats = '.stats {position: sticky; top: 0px; z-index: 99999;}';

// Add the first CSS rule to the stylesheet
sheet.insertRule(styles, 0);
sheet.insertRule(stylesStats, 0);
