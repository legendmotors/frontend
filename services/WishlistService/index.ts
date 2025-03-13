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
    if (!response || !response.data.success) {
      showNotification('Failed to add car to wishlist.', 'error');
      return null;
    }
    showNotification('Car added to wishlist successfully!');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error adding to wishlist:', error.response?.data?.message);
      showNotification(
        error.response?.data?.message || 'An error occurred while adding to wishlist.',
        'error'
      );
    } else {
      console.error('Unexpected error:', error);
      showNotification('An unexpected error occurred.', 'error');
    }
    return null;
  }
};

/* List Wishlist Items */
export const listWishlist = async (params: Record<string, any> = {}) => {
  try {
    const response = await api.get(Apis.GetWishlist, { params });
    if (!response || !response.data.success) {
      showNotification('No wishlist items found.', 'error');
      return { data: [] };
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching wishlist:', error.response?.data?.message);
      showNotification(
        error.response?.data?.message || 'An error occurred while fetching wishlist.',
        'error'
      );
    } else {
      console.error('Unexpected error:', error);
      showNotification('An unexpected error occurred.', 'error');
    }
    return { data: [] };
  }
};

/* Remove Wishlist Item */
export const removeFromWishlist = async (id: number) => {
  try {
    const response = await api.delete(Apis.DeleteWishlist, { params: { id } });
    if (!response || !response.data.success) {
      showNotification('Failed to remove wishlist item.', 'error');
      return false;
    }
    showNotification('Wishlist item removed successfully!');
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error removing wishlist item:', error.response?.data?.message);
      showNotification(
        error.response?.data?.message || 'An error occurred while removing wishlist item.',
        'error'
      );
    } else {
      console.error('Unexpected error:', error);
      showNotification('An unexpected error occurred.', 'error');
    }
    return false;
  }
};

export default {
  addToWishlist,
  listWishlist,
  removeFromWishlist,
};
