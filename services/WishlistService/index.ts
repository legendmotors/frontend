import Swal from 'sweetalert2';
import api from '@/utils/ApiConfig';
import { Apis } from '@/utils/apiUrls';
import axios from 'axios';

const showNotification = (message: string = '', icon: 'success' | 'error' = 'success') => {
    Swal.fire({
        title: message || (icon === 'error' ? 'Error' : 'Success'),
        icon,
        timer: 3000,
    });
};

/* Add Car to Wishlist */
export const addToWishlist = async (payload: { carId: number }) => {
    try {
        const response = await api.post(Apis.AddToWishlist, payload);
        return response.data;
    } catch (error) {
        console.error('Unexpected error:', error);
        return null;
    }
};

/* List Wishlist Items */
export const listWishlist = async (params: Record<string, any> = {}) => {
    try {
        const response = await api.get(Apis.GetWishlist, { params });

        return response.data;
    } catch (error) {

        console.error('Unexpected error:', error);
        return { data: [] };
    }
};

/* Remove Wishlist Item */
export const removeFromWishlist = async (payload: { userId: number, carId: number }) => {
    try {
        const response = await api.delete(Apis.DeleteWishlist, { params: payload });
        if (!response || !response.data.success) {
            return false;
        }
        return true;
    } catch (error) {

        console.error('Unexpected error:', error);
        return false;
    }
};

export default {
    addToWishlist,
    listWishlist,
    removeFromWishlist,
};
