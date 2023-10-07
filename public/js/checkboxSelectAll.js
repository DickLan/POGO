document.addEventListener('DOMContentLoaded', function () {
  var selectAll = document.getElementById('selectAll');
  var checkboxes = document.querySelectorAll('input[type="checkbox"][name="team"]');

  selectAll.addEventListener('change', function () {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = selectAll.checked;
    });
  });

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      var allChecked = true;
      checkboxes.forEach(function (checkbox) {
        if (!checkbox.checked) {
          allChecked = false;
        }
      });
      selectAll.checked = allChecked;
    });
  });
});

