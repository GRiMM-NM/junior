import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { JSX, useContext, useEffect, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { UserContext } from './../UserContext';

interface OptionProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export default function ProfilScreen(): JSX.Element {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const context = useContext(UserContext);
  if (!context) throw new Error("ProfilScreen must be wrapped in a UserProvider");
  const { imageUri, setImageUri } = context;

  // Vérifie si l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      const value = await AsyncStorage.getItem("isAdmin");
      setIsAdmin(value === "true");
    };
    checkAdmin();
  }, []);

  const pickImage = async () => {
    const openCamera = async () => {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission refusée", "Autorisez l'accès à l'appareil photo.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    };

    const openGallery = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission refusée", "Autorisez l'accès à vos photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', 'Prendre une photo', 'Choisir depuis la galerie'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openCamera();
          else if (buttonIndex === 2) openGallery();
        }
      );
    } else {
      Alert.alert('Choisir une image', '', [
        { text: 'Prendre une photo', onPress: openCamera },
        { text: 'Galerie', onPress: openGallery },
        { text: 'Annuler', style: 'cancel' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mon Profil</Text>

<View style={styles.avatarContainer}>
  <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
    <View style={styles.avatarWrapper}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri } as ImageSourcePropType}
          style={[styles.avatar, isAdmin && styles.avatarAdmin]}
        />
      ) : (
        <View style={[styles.avatarPlaceholder, isAdmin && styles.avatarAdmin]}>
          <FontAwesome name="user" size={60} color="#9BB1BC" />
        </View>
      )}
      {isAdmin && (
        <View style={styles.adminStar}>
          <AntDesign name="star" size={20} color="#FFD700" />
        </View>
      )}
    </View>
  </TouchableOpacity>

  <Text style={styles.editPhoto}>Modifier la photo</Text>
  {isAdmin && (
    <Text style={styles.adminBadge}>Administrateur</Text>
  )}
</View>

      <ScrollView style={styles.options} showsVerticalScrollIndicator={false}>
        <Option
          icon={<FontAwesome name="user" size={24} color="#075B7A" />}
          label="Modifier le profil"
          onPress={() => router.push('/modifierProfil')}
        />
        <Option
          icon={<FontAwesome name="history" size={24} color="#075B7A" />}
          label="Missions récemment consultées"
          onPress={() => router.push('/HistoriqueScreen')}
        />
        <Option
          icon={<FontAwesome name="lock" size={24} color="#075B7A" />}
          label="Confidentialité du compte"
          onPress={() => router.push('/ConfidentialiteScreen')}
        />
        <Option
          icon={<FontAwesome name="question-circle" size={24} color="#075B7A" />}
          label="Aide"
          onPress={() => router.push('/AideScreen')}
        />
        <Option
          icon={<FontAwesome name="sign-out" size={24} color="#D9534F" />}
          label="Se déconnecter"
          onPress={() => router.push('/deconnexionScreen')}
        />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push('/Profile')}>
          <FontAwesome name="user" size={28} color="#075B7A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Accueil')}>
          <FontAwesome name="home" size={28} color="#075B7A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Articles')}>
          <FontAwesome name="book" size={28} color="#075B7A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Evenement')}>
          <FontAwesome name="calendar" size={28} color="#075B7A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Option: React.FC<OptionProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.optionLabel}>{label}</Text>
      <Feather name="chevron-right" size={20} color="#075B7A" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FCFD',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#075B7A',
    marginBottom: 20,
    alignSelf: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#075B7A',
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  avatarAdmin: {
    borderColor: '#004E64',
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#DDE7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhoto: {
    marginTop: 8,
    color: '#075B7A',
    fontSize: 16,
    fontWeight: '600',
  },
  adminBadge: {
    marginTop: 4,
    backgroundColor: '#004E64',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
    fontSize: 14,
  },
  options: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F1F4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  iconWrapper: {
    marginRight: 15,
  },
  optionLabel: {
    flex: 1,
    fontSize: 17,
    color: '#075B7A',
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#9BE0F1',
    borderRadius: 20,
    bottom: 30,
    marginTop: 10,
  },
  avatarWrapper: {
  position: 'relative',
},
adminStar: {
  position: 'absolute',
  top: -5,
  right: -5,
  backgroundColor: '#075B7A',
  borderRadius: 10,
  padding: 3,
},
});
