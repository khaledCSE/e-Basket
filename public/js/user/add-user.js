function shContent(marker) {
    var shc = document.getElementById('info')
    shc.style.display = marker.checked ? 'block' : 'none'
  }

  function shSubmit(marker_tc) {
    var shc = document.getElementById('btn')
    shc.style.display = marker_tc.checked ? 'block' : 'none'
  }