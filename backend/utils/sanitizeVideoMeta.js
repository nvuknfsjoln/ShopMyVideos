function sanitizeVideoMeta(meta) {
    return {
        title: String(meta.title || '').trim(),
        description: String(meta.description || '').trim(),
        tags: Array.isArray(meta.tags) ? meta.tags.map(tag => tag.trim()) : [],
        price: Number(meta.price || 0),
        isPublic: !!meta.isPublic
    };
}

module.exports = { sanitizeVideoMeta };
