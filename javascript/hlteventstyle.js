require(['jquery'], function($) {
	$('li.calendar_event_course > a,.block_calendar_upcoming .event > a,.eventlist .event > h3 > a').each(function() {
		if ($(this).text().match(/^HLT Set:/)) {
			$(this).parent().addClass( 'mod_resourceduedate_setdate_event' );
		}
		if ($(this).text().match(/^HLT Due:/)) {
			$(this).parent().addClass( 'mod_resourceduedate_duedate_event' );
		}
	});

	$('body#page-mod-resourceduedate-mod input#id_showdescription').each(function() {
		$(this).prop('checked', true);
	});

	// determine HLT Due events that are not tagged appropriately
	$('.event').each(function() {
		$(this).find('a').each(function() {
			if ($(this).attr('href').indexOf('assign') != -1) {
				$(this).parent().addClass( 'mod_resourceduedate_duedate_event' );

				if ($(this).text().indexOf('HLT Due:') != 0 && $(this).text().indexOf('HLT Set:') != 0) {
					$(this).text('HLT Due: ' + $(this).text());
				}
			}
		});
	});

	$('.event[data-eventtype-course="1"]').each(function() {

	});
	$('.event[data-eventtype-course="1"] > a[data-type="event"]').each(function() {
		if ($(this).text().endsWith('is due')) {
			$(this).parent().addClass('hlt-duedate');
		}
	} );
	$('table.calendarmonth a[data-action="view-event"]').each(function() {
		if ($(this).text().trim().endsWith('is due')) {
			$(this).addClass('hlt-duedate');
		}
		else if ($(this).text().trim().startsWith('HLT Set:')) {
			$(this).addClass('hlt-setdate');
		}

	});

	$('#id_assignsubmission_hlt_enabled').prop('checked', true);

	$('body#page-mod-assign-mod input#id_showdescription').prop('checked', true);


	/* track last edited assign for easy duplication */
	$(document).ready(function() {
	$('body#page-mod-assign-mod').each(function() {
		var cmid = null;
		$($(this).attr('class').split(' ')).each(function() {
			if (this.indexOf('cmid-') == 0) {
				cmid = this.substring(this.indexOf('-') + 1);
			}
		});

		if (cmid != null) {
			if (typeof console != 'undefined') {
				console.log('detected cmid ' + cmid);
			}
			$.cookie( 'hlt_last_edited_cmid', cmid, { expires: 2, path: '/' });
		}

		if (location.search.indexOf('update=') != -1) {
			window.setTimeout(function() {
				if (typeof console != 'undefined') {
					console.log('Hooking update= to save assign entries');
				}
				// treat edit forms differently -- grab the details without form submission occurring
				$.cookie( 'hlt_last_edited_name', $('#id_name').val(), { expires: 2, path: '/' });
				$.cookie( 'hlt_last_edited_introeditoreditable', $('#id_introeditoreditable').html(), { expires: 2, path: '/' });
				$.cookie( 'hlt_last_edited_introattachments', $('input[name=\'introattachments\']').val(), { expires: 2, path: '/' });
			}, 2800);
		}

		$('.mform').submit(function() {
			if (typeof console != 'undefined') {
				console.log('Hooking mform submit to save assign entries');
			}
			$.cookie( 'hlt_last_edited_name', $('#id_name').val(), { expires: 2, path: '/' });
			$.cookie( 'hlt_last_edited_introeditoreditable', $('#id_introeditoreditable').html(), { expires: 2, path: '/' });
			$.cookie( 'hlt_last_edited_introattachments', $('input[name=\'introattachments\']').val(), { expires: 2, path: '/' });

		});

		if ($.cookie('hlt_last_edited_name')) {
			$('#id_general > .ftoggler').after( '<div style="text-align:center"><button id="hlt_duplmetadata" class="btn btn-secondary">Copy details from last edited HLT</button><br /></div>');

			$('#hlt_duplmetadata').click(function(e) {
				e.preventDefault();
				
				if ($('#id_name').val().length > 0 || ($('#id_introeditoreditable').html().length > 0 && $('#id_introeditoreditable').html() != '<p><br></p>')) {
					if (!confirm( 'This will overwrite what is currently set below. Are you sure?' ) ) {
						return;
					}
				}

				$('#id_name').val($.cookie( 'hlt_last_edited_name'));
				$('#id_introeditoreditable').html($.cookie( 'hlt_last_edited_introeditoreditable'));
				$('input[name=\'introattachments\']').val($.cookie( 'hlt_last_edited_introattachments'));
			});

		}

	});
	});

	/* count up points */
	$(document).ready(function() {
		$('h4.counter').each(function() {
			if (!isNaN(parseInt($(this).text(), 10)) && typeof $(this).data('value') !== 'undefined') {
				$(this).text('0');
				$(this).countTo({
					from: 0,
					to: $(this).data('value')
				});
			}
		});

		/* da da da da da da da da da */
		window.setTimeout(function() {
			$('h4#cybcount').html('It\'s');
			window.setTimeout(function() {
				$('h4#cybcount').html('the');
				window.setTimeout(function() {
					$('h4#cybcount').html('final');
					window.setTimeout(function() {
						$('h4#cybcount').html('countdown');
					}, 1000);
				}, 1000);
			}, 1000);
		}, Math.random() * 8000);
	});

	/* Extra Curricular Block -- show event data */
	$('.block_extracurricular .content > .event > h5 > a').click(function(e) {
		e.preventDefault();
		$('#tvs-extracurricular-event-inline-description-' + $(this).data('event-id')).toggle('slow');
	});


	/* for calendar HLT responsive only */

	var hasAddedDayNames = false;
	$(window).resize(function() {
		if ($(window).width() < 800 && !hasAddedDayNames) {
			$('td.day').each(function() {

			    var col =  $(this).parent().children().index($(this));
			    var row = $(this).parent().parent().children().index($(this).parent());
			    //console.log(col + ' and ' + row);

			    var daycell = $(this);

			    $('.calendarmonth.calendartable th').each(function() {

			       if ($(this).hasClass('c' + col)) {
				  $(daycell).prepend('<span class="tvs-day-name">' + $(this).text() + ' </span>' );
				  return false;
			       }
			    });

			  });
			  hasAddedDayNames = true;
		}
		else if ($(window).width >= 800) {
			$('.tvs-day-name').each(function() { $(this).remove(); });
			hasAddedDayNames = false;
		}
	});
	$(window).trigger('resize');

});
