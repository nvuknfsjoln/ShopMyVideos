document.addEventListener('DOMContentLoaded', () => {
  // Löschen von Videos oder Nutzern
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const type = btn.dataset.type; // 'video' oder 'user'
      const id = btn.dataset.id;
      if (!confirm(`Bist du sicher, dass du dieses ${type} löschen möchtest?`)) return;

      try {
        const res = await fetch(`/admin/delete/${type}/${id}`, {
          method: 'DELETE',
        });

        const result = await res.json();
        if (result.success) {
          document.querySelector(`#item-${id}`)?.remove();
        } else {
          alert('Fehler: ' + result.message);
        }
      } catch (err) {
        console.error(err);
        alert('Fehler beim Löschen.');
      }
    });
  });

  // Benutzer-Suche oder Filter (optional)
  const userSearch = document.querySelector('#userSearch');
  if (userSearch) {
    userSearch.addEventListener('input', async () => {
      const query = userSearch.value.trim();
      const res = await fetch(`/admin/users?q=${encodeURIComponent(query)}`);
      const users = await res.json();
      updateUserList(users);
    });
  }

  function updateUserList(users) {
    const container = document.querySelector('#userList');
    container.innerHTML = '';
    users.forEach(user => {
      const div = document.createElement('div');
      div.id = `item-${user.id}`;
      div.innerHTML = `
        <span>${user.username} (${user.role})</span>
        <button class="delete-btn" data-type="user" data-id="${user.id}">Löschen</button>
      `;
      container.appendChild(div);
    });
  }
});
