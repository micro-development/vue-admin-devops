const baseUrl = '/ci'
export const add = (data, opts) => {
    return {
        method: 'post',
        url: `${baseUrl}/task`,
        data,
        opts
    }
}

export const detail = (data, opts) => {
    return {
        method: 'get',
        url: `${baseUrl}/task/${data.uuid}`,
        data: {},
        opts
    }
}

export const list = (data, opts) => {
    return {
        method: 'get',
        url: `${baseUrl}/task/list`,
        data,
        opts
    }
}

export const update = (data, opts) => {
    return {
        method: 'patch',
        url: `${baseUrl}/task/${data.uuid}`,
        data,
        opts
    }
}

export const remove = (data, opts) => {
    return {
        method: 'delete',
        url: `${baseUrl}/task/${data.uuid}`,
        data,
        opts
    }
}
