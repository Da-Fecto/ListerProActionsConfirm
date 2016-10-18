var confirmExecute = (function () {

	"use strict";

	var settings,
		prefix,
		suffix,
		total,
		$confirm,
		$checkLabel,
		$checkHeader,
		$submit;

	function serverTotal (results) {
		settings = results;
		total = results.total;
		$checkLabel.text(prefix + total + suffix);
		$checkHeader.find(".fa-cog").remove();
	}

	function confirmChange() {
		$submit.toggle(this.checked && total > 0);
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

			if (what === "all") {
				total = settings.total;
			} else {
				total = what.split(",").length;
			}

			$checkLabel.text(prefix + total + suffix);

		}, 10);
	}

	function init() {
		settings = ProcessWire.config.ListerProActionsConfirm;
		prefix = settings.checkLabel[0];
		suffix = settings.checkLabel[1];

		$confirm = $("#confirm");
		$checkLabel = $confirm.next(".pw-no-select");
		$checkHeader = $confirm.closest(".Inputfield").find(".InputfieldHeader");
		$submit = $("#Inputfield_run_action");

		$submit.hide(0);
		$checkLabel.text(prefix + settings.filter + suffix);
		$checkHeader.prepend("<i class='fa fa-cog fa-spin' style='margin: 0.25em;'></i>");

		$(".actions_toggle").on("click", changeInput);
		$("[name='actions_items']").on("change", changeInput);
		$confirm.on("change", confirmChange);

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
		})
	};
}());
