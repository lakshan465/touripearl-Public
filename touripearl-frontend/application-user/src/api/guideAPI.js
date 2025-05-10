import axiosFetch from '../utils/axiosFetch';

export const getGuideProfile = async (id) => {
    const response = await axiosFetch.get(`/api/v1/guide/${id}`);
    return response.data;
};

