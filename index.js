var rewardPrice=0;
isMobile=(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

$(function() {

  if(isMobile) {
    $('video').hide();
  }


  $('.modal .close').bind('click',function(e) {
        $('.modal').hide();
          $('.modal-stripe-or-paypal').hide();
        $('.modal-background').hide();
  });

	$('.donate-button').bind('click',function() {
		$('.modal').show();
		$('.modal-background').show();
	});

	$('.modal-background').bind(
			'click',
			function () {
				$('.modal').hide();
          $('.modal-stripe-or-paypal').hide();
				$('.modal-background').hide();
	});

  var handler = StripeCheckout.configure({
    key: 'pk_live_t5hllnUD2DNNycqzZkKUyJcL',
    image: 'http://104.236.158.80/wp-content/uploads/2014/12/icon_compass.png',
    token: function(token) {
      $.ajax({
        type: "POST",
        url: "/charge.php/",
        dataType: 'json',
        data: {
          token:token.id,
          price:rewardPrice
        },
        success: function(reply) {
          if(reply.success='true') {
            alert("Thanks for your donation!");
            $('.modal').hide();
            $('.modal-stripe-or-paypal').hide();
            $('.modal-background').hide();
          }
          else {
            alert(reply.reason);
          }
        },
        error: function(reply) {
          alert(reply.reason);
          // alert("Sorry, something went wrong. After clicking OK, I'll foward you to PayPal as an alternative. Thanks!");
            // window.location.href='https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EN7DV8PAMJYPW&lc=US&item_name=Digital%20Nomad%20Documentary&item_number=Digital%20Nomad%20Documentary&amount='+(rewardPrice/100)+'%2e00&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted';
          }
      });
    }});

  $('.bar .progress').css('width','0%');
  setTimeout(function() {
    $('.bar .progress').css('width',
      parseInt(str_replace(',','',str_replace('$','',$('.donated').text())))/10000*100+'%'
    );
  },1000);
  

  $('.modal .rewards .reward').on('click', function(e) {
    priceText=$(this).find('.price').text();
    price=$(this).data('price');
    rewardPrice=price;
    $('.modal').hide();
    $('.modal-stripe-or-paypal').show();
  });
  
  $('.modal-stripe-or-paypal .paypal').on('click',function(e) {
    $(this).html('<i class="fa fa-spin fa-spinner"></i>');
    window.location.href='https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=EN7DV8PAMJYPW&lc=US&item_name=Digital%20Nomad%20Documentary&item_number=Digital%20Nomad%20Documentary&amount='+(price/100)+'%2e00&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted';
    return;
  });


  $('.modal-stripe-or-paypal .stripe').on('click',function(e) {
    $(this).html('<i class="fa fa-spin fa-spinner"></i>');
    $('.modal').hide();
    $('.modal-background').hide();

    // Open Checkout with further options
    handler.open({
      name: 'Digital Nomad Documentary',
      description: 'Donation of $' + (price/100),
      amount: price,
      panelLabel: 'Donate'
    });
    e.preventDefault();
  });

  // Close Checkout on page navigation
  $(window).on('popstate', function() {
    handler.close();
  });



});


function str_replace(search, replace, subject, count) {

  var i = 0,
    j = 0,
    temp = '',
    repl = '',
    sl = 0,
    fl = 0,
    f = [].concat(search),
    r = [].concat(replace),
    s = subject,
    ra = Object.prototype.toString.call(r) === '[object Array]',
    sa = Object.prototype.toString.call(s) === '[object Array]';
  s = [].concat(s);
  if (count) {
    this.window[count] = 0;
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp)
        .split(f[j])
        .join(repl);
      if (count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }
  return sa ? s : s[0];