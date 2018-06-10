$(function () {
  const groupSelect = $('#group');
  const nameInput = $('#validationCustom02');
  const organizerInput = '1';
  const location_addressInput = $('#validationCustom03');
  const cityInput = $('#validationCustom05');
  const stateInput = $('#validationCustom04');
  const dateInput = $('#date-input');
  const timeInput = $('#time-input');
  const descriptionInput = $('#exampleFormControlTextarea1');
  const createeventForm = $('#createevent');

  $('#createevent').on('submit', handleFormSubmit);

  // let url = window.location.search;
  // let peopleId;
  let groupId;
  let updating = false;

  getGroups();

  function handleFormSubmit(event) {
    event.preventDefault();

    if (!groupSelect.val()) {
      return;
    }
    const newEvent = {
      name: nameInput.val().trim(),
      organizer: organizerInput,
      location_address: location_addressInput.val().trim(),
      city: cityInput.val().trim(),
      state: stateInput.val().trim(),
      date: dateInput.val().trim(),
      time: timeInput.val().trim(),
      description: descriptionInput.val().trim(),
      GroupId: groupSelect.val(),
    };

    if (updating) {
      newEvent.id = eventId;
      updateEvent(newEvent);
    }
    else {
      submitEvent(newEvent);
    }

    function submitEvent(event) {
      $.ajax('/api/events', {
        type: 'POST',
        data: newEvent
      }).then(function () {
        // console.log('Created New Event');
        window.location.href = '/';
      });
    }
  }

  function getEventData(id, name) {
    let queryURL;
    switch (name) {
      case 'event':
        queryURL = '/api/events' + id;
        break;
      case 'group':
        queryURL = '/api/groups/' + id;
        break;
      default:
        return;
    }
    $.get(queryURL, function (data) {
      if (data) {
        // console.log(data.peopleId || data.id);
        nameInput.val(data.name);
        groupId = data.groupId || data.id;

        updating = true;
      }
    });
  }

  // these three functions create option elements in select group dropdown
  function getGroups() {
    $.get('/api/groups', renderGroupList);
  }

  function renderGroupList(data) {
    let rowsToAdd = [];
    if (!data.length) {
      window.location.href = '/createGroup';
    }
    for (let i = 0; i < data.length; i++) {
      rowsToAdd.push(createGroupRow(data[i]));
    }
    groupSelect.empty();
    groupSelect.append(rowsToAdd);
    groupSelect.val(groupId);
  }

  function createGroupRow(group) {
    const listOption = $('<option>');
    listOption.attr('value', group.id);
    listOption.text(group.name);
    return listOption;
  }

  function updateEvent(event) {
    $.ajax({
      method: 'PUT',
      url: '/api/events',
      data: event,
    })
      .then(function () {
        window.location.href = '/';
      });
  }
});
