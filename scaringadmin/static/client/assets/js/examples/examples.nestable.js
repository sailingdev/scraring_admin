/*
Name: 			UI Elements / Nestable - Examples
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version: 	2.0.0
*/

(function($) {

	'use strict';
		
	/*
	Update Output
	*/
	var list_data;
	var updateOutput = function (e) {
		var list = e.length ? e : $(e.target),
			output = list.data('output');
		if (window.JSON) {
			output.val(window.JSON.stringify(list.nestable('serialize')));
			list_data =list.nestable('serialize');
		} else {
			output.val('JSON browser support required for this demo.');
		}
	};

	/*
	Nestable 1
	*/
	$('#nestable').nestable({
		group: 1
	}).on('change', updateOutput);

	/*
	Output Initial Serialised Data
	*/
	$(function() {
		updateOutput($('#nestable').data('output', $('#nestable-output')));
	});

	$('#btn_save_nestCategory').click(function () {
		var categories = JSON.stringify(list_data);
		$.ajax({
			url: '/ctgadmin/categories/change',
			method: 'post',
			data: {
				'categories': categories
			},
			success: function (res) {
				location.reload()
            }
		});
    })

}).apply(this, [jQuery]);