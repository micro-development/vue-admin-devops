const baseUrl = '/ci'
export const add = (data, opts) => {
    return {
        method: 'post',
        url: `${baseUrl}/build`,
        data,
        opts
    }
}

export const detail = (data, opts) => {
    return {
        method: 'get',
        url: `${baseUrl}/build/${data.uuid}`,
        data: {},
        opts
    }
}

export const list = (data, opts) => {
    return {
        method: 'post',
        url: `${baseUrl}/build/list`,
        data,
        opts
    }
}

export const update = (data, opts) => {
    return {
        method: 'patch',
        url: `${baseUrl}/build/${data.uuid}`,
        data,
        opts
    }
}

export const remove = (data, opts) => {
    return {
        method: 'delete',
        url: `${baseUrl}/build/${data.uuid}`,
        data,
        opts
    }
}
