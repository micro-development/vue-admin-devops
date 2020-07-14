const baseUrl = '/ci'
export const add = (data, opts) => {
    return {
        method: 'post',
        url: `${baseUrl}/env`,
        data,
        opts
    }
}

export const detail = (data, opts) => {
    return {
        method: 'get',
        url: `${baseUrl}/env/${data.uuid}`,
        data: {},
        opts
    }
}

export const list = (data, opts) => {
    return {
        method: 'get',
        url: `${baseUrl}/env/list`,
        data,
        opts
    }
}

export const update = (data, opts) => {
    return {
        method: 'patch',
        url: `${baseUrl}/env/${data.uuid}`,
        data,
        opts
    }
}

export const remove = (data, opts) => {
    return {
        method: 'delete',
        url: `${baseUrl}/env/${data.uuid}`,
        data,
        opts
    }
}
