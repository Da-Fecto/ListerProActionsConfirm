(function () {

	"use strict";

	var settings,
		prefix,
		suffix,
		total,
		executeIcon,
		$confirm,
		$checkLabel,
		$submit,
		$stop;

	function serverTotal (results) {
		settings = $.extend(settings, results);
		total = results.total;
		$checkLabel.text(prefix + settings.total + suffix);
	}

	function stopExecuting() {
		$('span i', $submit).attr('class', executeIcon);
		$submit.removeClass("ui-state-active");
		$(this).remove();
		"stop" in window ? window.stop() : document.execCommand("Stop");

		var iframe = document.getElementById('actions_viewport'),
			$iframeDocument = $('body > pre', iframe.contentDocument || iframe.contentWindow.document),
			$iframeContent = $(iframe).contents();

		$iframeDocument.append($("<span><br>" + settings.text.abort + "</span>"));
		$iframeContent.scrollTop($iframeContent.height());
	}

	function confirmChange() {
		$submit.toggle(this.checked && total > 0);	}

	function uncheckConfirm (event) {
		$stop = $stop || $("<button class='ui-button ui-widget ui-corner-all ui-state-default' style='margin-left: 0.5em;' id='stop'><span><i class='fa fa-times'></i> " + settings.text.stop + "</span></button>");
		$stop.insertAfter($submit);
		$confirm.attr('checked', false);
		$stop.on('click', stopExecuting);
	}

	function changeInput() {
		var that = this,
			what;

		setTimeout(function () {
			if (that.nodeName === "A") {
				what = $("[name='actions_items']:checked").val();
			} else if (that.nodeName === "INPUT") {
				what = that.value;
			}

			total = (what === "all") ? settings.total : what.split(",").length;
			$checkLabel.text(prefix + total + suffix);

		}, 10);
	}

	/**
	 * After lister has run, #submit_refresh is clicked from iframe
	 *
	 * Then clean up all previous action form values and the actions checkboxes.
	 *
	 */
	function clearActions (event) {
		$(".Inputfield_actions input").each(function() { this.checked = false; });
		$("[class*='Inputfield_PageAction'] :input").val('');
	}

	function init() {
		settings = ProcessWire.config.ListerProActionsConfirm;
		prefix = settings.text.checkLabel[0];
		suffix = settings.text.checkLabel[1];

		$confirm = $("#confirm");
		$checkLabel = $confirm.next(".pw-no-select");
		$submit = $("#Inputfield_run_action");
		$submit.hide(0);
		$("#stop").remove();
		executeIcon = $('span i', $submit).attr('class');
		$checkLabel.text(prefix + settings.total + suffix);

		// events
		$(".actions_toggle").on("click", changeInput);
		$("[name='actions_items']").on("change", changeInput);
		$confirm.on("change", confirmChange);
		$submit.on("click", uncheckConfirm);

		$.post(settings.ajax, serverTotal, "JSON");
	}

	return {
		init: $(function () {
			if (!$("#ProcessLister").length) {
				return;
			}

			$("#ProcessListerResults").on("loaded", function() {
				init();
			});

			// clear actions after listerpro has run
			$("#submit_refresh").on('click', clearActions);
		})
	};
}());
