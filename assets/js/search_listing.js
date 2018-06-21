$(document).ready(function(){

	// Show default listing
	var first_name = null;
	var last_name = null;
	$(".jsSearchBtn").attr('disabled', true);


	showListings(first_name, last_name);

	// Search Listing
	$(".jsSearchBtn").on('click', function(){
		$(".jsSearchListingTbl tbody").empty();
		loadingDetails();
		$(this).attr('disabled', true);
		first_name = $(".jsFirstname").val();
		last_name = $(".jsLastname").val();
		showListings(first_name, last_name);
	});

	// Load details
	$(".jsSearchListingTbl").on('click', 'tr', function() {
		var details = $(this).data('details');
		var modal = $(".jsStudentModal");
		var ani_date = '-';
		if(details) {

			if(details.anniversary_date) {
				ani_date = new Date(details.anniversary_date);
				ani_date = ani_date.toDateString();
			}
			$(".jsFirstname", modal).text(details.first_name);
			$(".jsLastname", modal).text(details.last_name);
			$(".jsGroupNo", modal).text(details.group_no);
			$(".jsListNo", modal).text(details.list_no);
			$(".jsTitleCode", modal).text(details.list_title_code);
			$(".jsAgencDesc", modal).text(details.list_agency_code);
			$(".jsTitleDes", modal).text(details.list_agency_desc);
			$(".jsExamNo", modal).text(details.exam_no);
			$(".jsAnniDate", modal).text(ani_date);
			modal.modal('show');
		} else {
			alert('Opps...error occured');
		}
	});
	
});


function showListings(first_name, last_name) {
	var searchurl = 'https://data.cityofnewyork.us/resource/5scm-b38n.json';
	if(first_name && last_name) {
		searchurl += '?first_name='+ first_name +'&last_name=' + last_name;
	} else {
		if(first_name) {
			searchurl += '?first_name='+ first_name;
		} else if(last_name) {
			searchurl += '?last_name=' + last_name;
		}
	}

	$.ajax({
		xhr : function() {
			var xhr = new window.XMLHttpRequest();
			xhr.addEventListener("progress", function(evt) {
               var percentComplete = evt.loaded / evt.total;
               $(".jsProgressBar .jsProgress").css('width', percentComplete + '%');
       		}, false);
       	return xhr;
		},
		url : searchurl,
		type : 'GET',
		success : function(res) {
			if(res) {
				appendResults(res);
			}
		},
		error : function(err) {

		},
		statusCode : {
			404: function() {
				alert('Invalid Request sent.');
			}
		}
	});
}

function appendResults(data) {
	$(".jsSearchListingTbl tbody").empty();
	if(data.length) {
		$.each(data, function(i, e){
			var date = '-';
			if(e.published_date) {
				publish_date = new Date(e.published_date);
				date = publish_date.toDateString();
			}
			
			var tr = $('<tr>').data('details', e).attr('title', 'Click here for more details');
			var list_no = $('<td>').text(e.list_no);
			var exam_no = $('<td>').text(e.exam_no);
			var first_name = $('<td>').text(e.first_name);
			var last_name = $('<td>').text(e.last_name);
			var list_agency_desc = $('<td>').text(e.list_agency_desc);
			var list_title_desc = $('<td>').text(e.list_title_desc);
			var pub_dt = $('<td>').text(date);
			tr.append(list_no).append(exam_no).append(first_name).append(last_name).append(list_agency_desc).append(list_title_desc).append(pub_dt);
			$(".jsSearchListingTbl tbody").append(tr);
		});
	} else {
		var tr = $('<tr>');
		var not_found = $('<td>').text('No record found').addClass('text-center').attr('colspan', 7);
		tr.append(not_found);
		$(".jsSearchListingTbl tbody").append(tr);
	}
	$(".jsSearchBtn").attr('disabled', false);
}

function detailsNotFound() {
	var tr = $('<tr>');
	var not_found = $('<td>').text('No record found').addClass('text-center').attr('colspan', 7);
	tr.append(not_found);
	$(".jsSearchListingTbl tbody").append(tr);
}

function loadingDetails() {
	var tr = $('<tr>');
	var loading = $('<td>').text('Loading...').addClass('text-center').attr('colspan', 7);
	tr.append(loading);
	$(".jsSearchListingTbl tbody").append(tr);	
}