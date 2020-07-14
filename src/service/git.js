const baseUrl = '/ci'
export const github = (data, opts) => {
    return {
        method: 'post',
        url: `${baseUrl}/git/github`,
        data,
        opts
    }
}

export const gitee = (data, opts) => {
    return {
        method: 'post',
        url: `${baseUrl}/git/gitee`,
        data,
        opts
    }
}

export const gitlab = (data, opts) => {
    return {
        method: 'post',
        url: `${baseUrl}/git/gitlab`,
        data,
        opts
    }
}

export const gitea = (data, opts) => {
    return {
        method: 'post',
        url: `${baseUrl}/git/gitea`,
        data,
        opts
    }
}
