/* eslint-disable no-unused-vars */

function navigateTo(route) {
    window.location.href = route;
}

function confirmDelete(path, redirectPath) {
    const confirmation = confirm('are you sure you want to delete this item');
    if (confirmation) {
        fetch(path, { method: 'DELETE' })
            .then(() => window.location = redirectPath);
    }
}
